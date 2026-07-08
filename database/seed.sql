INSERT INTO categories (id, title, description, icon, active, sort_order)
VALUES
  ('packaging', 'Packaging & Labels', 'Custom boxes and labeling solutions for your brand.', 'Package', 1, 10),
  ('offset', 'Offset Printing', 'High-volume, high-quality printing for brochures and flyers.', 'Printer', 1, 20),
  ('digital', 'Digital Printing', 'Short-run printing for cards, posters and more.', 'Layers', 1, 30),
  ('signage', 'Signage & Displays', 'Large scale banners and exhibition stands.', 'Maximize', 1, 40),
  ('gifts', 'Gift Packs & Giveaways', 'Branded merchandise for your team and clients.', 'Gift', 1, 50)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  icon = VALUES(icon),
  active = VALUES(active),
  sort_order = VALUES(sort_order);

INSERT INTO products (id, category_id, name, description, price, unit, image, max_quantity, options_json, active, sort_order)
VALUES
  ('custom-boxes', 'packaging', 'Custom Product Boxes', 'Premium folding cartons for retail and e-commerce.', 1.50, 'per box', 'https://images.unsplash.com/photo-1542319630-55fb7f7c944a?auto=format&fit=crop&q=80&w=800&h=600', 10000, CAST('[{"id":"material","label":"Material","type":"select","values":["Kraft Paper","White Cardboard","Corrugated"],"required":true},{"id":"dimensions","label":"Dimensions (WxHxD)","type":"text","placeholder":"e.g., 10x10x5 cm","required":true},{"id":"finish","label":"Finish","type":"select","values":["Matte","Glossy","UV Coated"],"required":true}]' AS JSON), 1, 10),
  ('product-labels', 'packaging', 'Product Labels', 'High-quality adhesive labels in various shapes.', 0.05, 'per label', 'https://images.unsplash.com/photo-1626015270271-e73792040f7b?auto=format&fit=crop&q=80&w=800&h=600', 50000, CAST('[{"id":"shape","label":"Shape","type":"select","values":["Rectangle","Circle","Oval","Custom Die-cut"],"required":true},{"id":"finish","label":"Finish","type":"select","values":["Matte","Glossy","Clear"],"required":true}]' AS JSON), 1, 20),
  ('bulk-flyers', 'offset', 'Bulk Flyers', 'Cost-effective flyers for large-scale marketing.', 45.00, 'per 1000', 'https://images.unsplash.com/photo-1644342939989-1065672049e6?auto=format&fit=crop&q=80&w=800&h=600', 50, CAST('[{"id":"paper-weight","label":"Paper Weight","type":"select","values":["130gsm","170gsm","250gsm"],"required":true},{"id":"sides","label":"Printing Sides","type":"select","values":["Single Sided","Double Sided"],"required":true},{"id":"finish","label":"Finish","type":"select","values":["None","Matte Lamination","Gloss Lamination"],"required":true}]' AS JSON), 1, 30),
  ('brochures', 'offset', 'Brochures', 'Professional trifold or bifold brochures.', 85.00, 'per 500', 'https://images.unsplash.com/photo-1544476915-ed1370594142?auto=format&fit=crop&q=80&w=800&h=600', 20, CAST('[{"id":"fold","label":"Fold Type","type":"select","values":["Trifold","Bifold","Z-Fold"],"required":true},{"id":"paper","label":"Paper","type":"select","values":["150gsm Silk","170gsm Gloss"],"required":true}]' AS JSON), 1, 40),
  ('business-cards', 'digital', 'Premium Business Cards', 'Make a great first impression.', 25.00, 'per 100', 'https://images.unsplash.com/photo-1589330694653-96b653457a41?auto=format&fit=crop&q=80&w=800&h=600', 50, CAST('[{"id":"corners","label":"Corners","type":"select","values":["Standard","Rounded"],"required":true},{"id":"finish","label":"Premium Finish","type":"select","values":["Soft Touch","Spot UV","Gold Foil"],"required":true}]' AS JSON), 1, 50),
  ('posters', 'digital', 'High-Res Posters', 'Vibrant indoor posters in various sizes.', 12.00, 'per poster', 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&q=80&w=800&h=600', 100, CAST('[{"id":"size","label":"Size","type":"select","values":["A3","A2","A1","A0"],"required":true},{"id":"paper","label":"Paper","type":"select","values":["Satin","Gloss","Matte Photography"],"required":true}]' AS JSON), 1, 60),
  ('vinyl-banners', 'signage', 'Vinyl Banners', 'Durable outdoor banners with eyelets.', 25.00, 'per sqm', 'https://images.unsplash.com/photo-1496162294208-99445100018b?auto=format&fit=crop&q=80&w=800&h=600', 50, CAST('[{"id":"eyelets","label":"Eyelets","type":"select","values":["Every 50cm","Corners Only","None"],"required":true},{"id":"wind-slits","label":"Wind Slits","type":"select","values":["Yes","No"],"required":true}]' AS JSON), 1, 70),
  ('branded-pens', 'gifts', 'Premium Metal Pens', 'Laser engraved or screen printed.', 2.50, 'per pen', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800&h=600', 1000, CAST('[{"id":"color","label":"Pen Color","type":"select","values":["Black","Silver","Navy Blue"],"required":true},{"id":"ink","label":"Ink Color","type":"select","values":["Black","Blue"],"required":true}]' AS JSON), 1, 80)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  unit = VALUES(unit),
  image = VALUES(image),
  max_quantity = VALUES(max_quantity),
  options_json = VALUES(options_json),
  active = VALUES(active),
  sort_order = VALUES(sort_order);
