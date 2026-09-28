"use client";
import { useState, useTransition } from "react";
import { ArrowRight, Check, CheckCircle2, Plus, Printer, Trash2 } from "lucide-react";
import { products, finishes, itemTotal, quoteTotal, money, type QuoteItem } from "@/lib/quotation";
import { submitLead } from "@/app/actions";
const initial: QuoteItem = { product: "sliding-window", width: 1.2, height: 1.2, quantity: 1, finish: "black" };

export default function QuoteBuilder() {
  const [items, setItems] = useState<QuoteItem[]>([{ ...initial }]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const update = (index: number, patch: Partial<QuoteItem>) => setItems(previous => previous.map((item, i) => i === index ? { ...item, ...patch } : item));
  const total = quoteTotal(items);
  function submit(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault(); setError("");
    const values = Object.fromEntries(new FormData(form.currentTarget));
    startTransition(async () => {
      try { const result = await submitLead({ ...values, consent: values.consent === "on", items }); if (result.error) setError(result.error); else setReference(result.id!); }
      catch { setError("Connection interrupted. Please try submitting again."); }
    });
  }
  if (reference) return <section id="quotation" className="section success"><CheckCircle2 size={46}/><p className="eyebrow">REQUEST RECEIVED</p><h2>Your next space starts here.</h2><p>Your quotation request has been saved. The team can now review your measurements and contact details.</p><div className="reference">Reference: {reference}<br/>Sample estimate: <strong>{money(total)}</strong></div><p className="muted">This is a preliminary estimate, subject to a site measurement and final specification.</p><div className="button-row"><button className="button primary" onClick={() => window.print()}><Printer size={16}/> Print confirmation</button><button className="button secondary" onClick={() => { setReference(""); setItems([{ ...initial }]); }}>Start another quotation</button></div></section>;
  return <section className="section quotation-section" id="quotation">
    <div className="section-heading"><div><p className="eyebrow">LET’S BUILD SOMETHING</p><h2>Your space. Your specifications.</h2></div><p>Plan your project with a quick estimate.<br/>We’ll help with the finer details.</p></div>
    <form className="quote-layout" onSubmit={submit}>
      <div className="quote-main"><div className="panel-title"><span className="step">01</span><h3>Build your quotation</h3><span className="small-label">Measurements in meters</span></div>
        {items.map((item, index) => <fieldset className="quote-item" key={index}><legend>Item {String(index + 1).padStart(2, "0")}</legend><div className="item-top"><label>Aluminum system<select value={item.product} onChange={e => update(index, { product: e.target.value as QuoteItem["product"] })}>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Frame finish<select value={item.finish} onChange={e => update(index, { finish: e.target.value as QuoteItem["finish"] })}>{finishes.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label></div><div className="measurements"><label>Width (m)<input type="number" min="0.3" max="6" step="0.01" required value={item.width || ""} onChange={e => update(index, { width: Number(e.target.value) })}/></label><span className="times">×</span><label>Height (m)<input type="number" min="0.3" max="6" step="0.01" required value={item.height || ""} onChange={e => update(index, { height: Number(e.target.value) })}/></label><label>Quantity<input type="number" min="1" max="100" step="1" required value={item.quantity || ""} onChange={e => update(index, { quantity: Number(e.target.value) })}/></label><div className="item-price"><small>Item estimate</small><strong>{money(itemTotal(item))}</strong></div>{items.length > 1 && <button className="icon-button" type="button" aria-label={`Remove item ${index + 1}`} onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 size={17}/></button>}</div></fieldset>)}
        <button className="add-item" type="button" disabled={items.length >= 20} onClick={() => setItems([...items, { ...initial }])}><Plus size={16}/> Add another item</button>
        <div className="panel-title contact-title"><span className="step">02</span><h3>Tell us about your project</h3></div>
        <div className="contact-grid"><label>Full name<input name="name" autoComplete="name" placeholder="Your full name" minLength={2} maxLength={100} required/></label><label>Email address<input name="email" autoComplete="email" type="email" placeholder="you@example.com" maxLength={200} required/></label><label>Phone number<input name="phone" autoComplete="tel" type="tel" placeholder="09XX XXX XXXX" pattern={"[+0-9\\s\\(\\)\\-]{7,25}"} required/></label><label>Project location<input name="location" autoComplete="street-address" placeholder="City / municipality" minLength={3} maxLength={200} required/></label><label className="full-width">Anything else we should know? <span className="muted">(optional)</span><textarea name="notes" placeholder="Project timeline, glass preferences, or special requirements…" maxLength={2000} rows={3}/></label></div>
        <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <label className="consent"><input type="checkbox" name="consent" required/><span>I agree that Ayezza Aluminum may store these details and contact me about my project. <a href="/privacy">Privacy policy</a></span></label>
      </div>
      <aside className="quote-summary"><p className="eyebrow">A CLEARER PICTURE</p><h3>Your project estimate</h3><div className="summary-lines">{items.map((item, index) => <div key={index}><span>{item.quantity} × {products.find(p => p.id === item.product)?.name}</span><strong>{money(itemTotal(item))}</strong></div>)}</div><div className="total-label">Estimated materials & fabrication</div><div className="quote-total" aria-live="polite">{money(total)}</div><p className="estimate-note">Sample pricing only. Installation, delivery, taxes and site-specific work are excluded. Final pricing follows a site assessment.</p><div className="summary-checks"><span><Check size={15}/> Made to your measurements</span><span><Check size={15}/> No obligation to proceed</span><span><Check size={15}/> Reviewed by our team</span></div>{error && <p role="alert" className="form-error">{error}</p>}<button className="button primary submit-button" disabled={pending} type="submit">{pending ? "Saving your request…" : "Request a formal quotation"}<ArrowRight size={17}/></button><span className="summary-foot">Let’s find the right fit for your space.</span></aside>
    </form>
  </section>;
}
