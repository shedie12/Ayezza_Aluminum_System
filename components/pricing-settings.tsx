"use client";
import { useActionState } from "react";
import { updatePricing } from "@/app/actions";
import { products, type Pricing } from "@/lib/quotation";

export default function PricingSettings({ pricing }: { pricing: Pricing }) {
  const [state, action, pending] = useActionState<{ error?: string; success?: string }, FormData>(updatePricing, {});
  return <form action={action} className="pricing-settings">
    <p>Set a PHP rate and billing unit for each product. Awnings are priced per piece. Changing the unit does not convert the number: enter the price you charge for that unit.</p>
    <p className="notice">Initial values are sample rates, not approved business prices. Measurements are entered in meters and converted automatically for square-foot pricing. Matte black adds 15%; powder white adds 10%. Cabinet estimates use front width × height. Awning prices use quantity, not area; please review any previously saved awning rate as a per-piece price. Depth, accessories, installation and other extras require a final quotation.</p>
    <div className="pricing-grid">{products.map(product => <fieldset key={product.id} className="pricing-card">
      <legend>{product.name}</legend>
      <label>Rate (PHP)<input name={`${product.id}.rate`} type="number" min="0.01" max="1000000" step="0.01" defaultValue={pricing[product.id].rate} required/></label>
      <label>Billing unit<select name={`${product.id}.unit`} defaultValue={pricing[product.id].unit}>
        {product.id === "awning" ? <option value="piece">Per piece</option> : <>
          <option value="sqm">Per square meter (m²)</option>
          <option value="sqft">Per square foot (ft²)</option>
        </>}
      </select></label>
    </fieldset>)}</div>
    {state.error && <p role="alert" className="form-error">{state.error}</p>}
    {state.success && <p role="status" className="notice">{state.success}</p>}
    <button className="button primary" disabled={pending}>{pending ? "Saving…" : "Save pricing settings"}</button>
  </form>;
}
