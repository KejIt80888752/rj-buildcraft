# R&J BuildCraft — Static Website

Home & Commercial Construction & Material Suppliers.
Plain HTML / CSS / JS — no build step, no dependencies. Open `index.html` and it runs.

## Pages

| File | What's on it |
|---|---|
| `index.html` | Hero, stats, about, 6 construction services, 24 searchable material categories, 4-step process, projects grid, testimonials, CTA, footer |
| `contact.html` | Contact cards, validated enquiry form, Google map, 5-question FAQ, footer |

Supporting files: `css/style.css`, `js/main.js`.

## Where the services came from

The material categories mirror the catalogue on <https://home-run.co>:

Cement · Tiling · Painting · Water Proofing · Plywood, MDF & HDHMR · Adhesives & Fevicol ·
Wires, MCB & DB Boards · Kitchen Sinks & Faucets · Sanitary & Bath Fittings · Switches & Sockets ·
Hinges, Channels & Handles · Kitchen Systems · Wardrobe & Bed Fittings · Door Locks & Hardware ·
Conduits & GI Boxes · Lighting · CPVC Pipes & Tanks · Ceiling Fans & Exhaust · Power Tools ·
CCTV & Surveillance · Appliances & Inverters · General Hardware & Tools · Safety Tools & Workwear ·
Glass Door Hardware

On top of that, six construction services were added, since R&J BuildCraft also builds
(HomeRun only supplies): residential, commercial, renovation, waterproofing & painting,
electrical & plumbing, interiors & carpentry.

## Placeholders to replace before going live

All of these are invented stand-ins — swap them for the real details:

| Placeholder | Where |
|---|---|
| `info@rjbuildcraft.com`, `sales@rjbuildcraft.com` | both HTML files |
| Working hours | both HTML files |
| "Since 2012" hero pill | `index.html` |
| Social links (`href="#"`) | footer of both files |
| Map location | `contact.html` → the `<iframe src>` query |
| Stats (480+, 24, 13+, 98%) | `index.html` → `data-count` attributes |
| Testimonial names & quotes | `index.html` |
| Project photos | `index.html` → `.project-img` background URLs (currently Unsplash) |
| Hero / about photos | `css/style.css` → `.hero-bg`, `.about-img`, `.page-hero` |

## Confirmed real details

- Phone: **+91 76766 98471** (primary, also the WhatsApp number) and **+91 85535 71895**
- Office: **BHIVE Premium, CMH Road Campus**, No. 467/468, Shri Krishna Temple Rd,
  Indiranagar 1st Stage, Bengaluru 560038
- Live at **https://randjbuildcraft.com** (GitHub Pages, repo `KejIt80888752/rj-buildcraft`)

## Photos

Hero, about and project images currently load from Unsplash over the network. For a fully
offline/self-hosted site, drop real photos into `images/` and point the URLs there instead.

## Contact form

There's no backend. On a valid submit, the form opens WhatsApp pre-filled with the enquiry
and shows a confirmation. To use email instead, swap the `window.open(...)` call in
`js/main.js` for a service like Formspree or FormSubmit and set the form's `action`.

## Running locally

```bash
python3 -m http.server 5185 --directory /Users/saran/Downloads/Files/rj-buildcraft
```

Then open <http://localhost:5185>. Or just double-click `index.html`.

## Deploying

Static — upload the folder as-is to GitHub Pages, Netlify, Vercel, or any shared host.
No build command, no environment variables.
