"""Stripe preorder — Checkout session + webhook. Real Stripe in test or
live mode; without a key the endpoint reports itself unconfigured rather
than faking a purchase."""

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

import settings
from db import get_session
from models import Order

router = APIRouter()


class CheckoutIn(BaseModel):
    email: EmailStr
    tier: str = "devkit"


class CheckoutOut(BaseModel):
    checkout_url: str
    order_id: str


@router.post("/preorder/checkout", response_model=CheckoutOut)
async def create_checkout(body: CheckoutIn, db: AsyncSession = Depends(get_session)):
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            503, "preorders not open yet: Stripe is not configured on this "
                 "deployment (set STRIPE_SECRET_KEY)")
    import stripe

    stripe.api_key = settings.STRIPE_SECRET_KEY

    if settings.STRIPE_PREORDER_PRICE_ID:
        line_items = [{"price": settings.STRIPE_PREORDER_PRICE_ID, "quantity": 1}]
    else:
        line_items = [{
            "price_data": {
                "currency": "usd",
                "unit_amount": settings.PREORDER_AMOUNT_USD * 100,
                "product_data": {
                    "name": "Exobod Dev Kit — preorder deposit",
                    "description": "Reserves one Exobod v1 desktop frame. "
                                   "Fully refundable until your unit ships.",
                },
            },
            "quantity": 1,
        }]

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        customer_email=body.email,
        success_url=f"{settings.WEB_ORIGIN}/preorder/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.WEB_ORIGIN}/#preorder",
    )
    order = Order(email=body.email.lower(), stripe_session_id=session.id,
                  tier=body.tier)
    db.add(order)
    await db.commit()
    return CheckoutOut(checkout_url=session.url, order_id=order.id)


@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_session)):
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(503, "stripe not configured")
    import stripe

    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        if settings.STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig, settings.STRIPE_WEBHOOK_SECRET)
        else:
            import json

            event = json.loads(payload)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(400, "invalid webhook payload")

    etype = event["type"] if isinstance(event, dict) else event.type
    data = (event["data"]["object"] if isinstance(event, dict)
            else event.data.object)

    if etype == "checkout.session.completed":
        sid = data["id"] if isinstance(data, dict) else data.id
        order = (await db.execute(
            select(Order).where(Order.stripe_session_id == sid)
        )).scalar_one_or_none()
        if order:
            order.status = "paid"
            db.add(order)
            await db.commit()
    elif etype == "checkout.session.expired":
        sid = data["id"] if isinstance(data, dict) else data.id
        order = (await db.execute(
            select(Order).where(Order.stripe_session_id == sid)
        )).scalar_one_or_none()
        if order and order.status == "pending":
            order.status = "canceled"
            db.add(order)
            await db.commit()

    return {"received": True}


@router.get("/preorder/status/{session_id}")
async def preorder_status(session_id: str, db: AsyncSession = Depends(get_session)):
    order = (await db.execute(
        select(Order).where(Order.stripe_session_id == session_id)
    )).scalar_one_or_none()
    if not order:
        raise HTTPException(404, "order not found")
    return {"order_id": order.id, "status": order.status, "tier": order.tier}
