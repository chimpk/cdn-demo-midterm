PROJECT TOPIC: 8 - Content Delivery Networks (CDNs)
COURSE: WEB PROGRAMMING & APPLICATIONS - 503073
STUDENT DEMO INSTRUCTIONS

1. WHAT IS THIS DEMO?
This completely static web application acts as a "Self-Analyzing Performance Dashboard". Rather than fetching random external API data, it looks at its own Network Request Headers using the HTML5 Navigation Timing API.
It allows students to fulfill exactly the two requirements listed in the syllabus for Topic 8:
- Host static assets on a CDN and compare performance before/after.
- Demonstrate cache invalidation.
- Demonstrate Custom Rules (Page Rules mapping).

2. HOW TO FULFILL THE MIDTERM REQUIREMENT "Compare performance before/after"
Step 1: Get a cheap/free standard hosting server (like Heroku, Digital Ocean VPS, Github Pages without CDN) or just start a raw local web server with ngrok. This acts as the "Origin Server".
Step 2: Upload this folder to your server.
Step 3: Open the site. Show the video recording the TTFB (Time To First Byte). It will be high (~300ms-800ms) if your server is far from your location.
Step 4: Purchase or use a free domain, and setup Cloudflare DNS. Turn "Proxy Status" ON (Orange Cloud). This activates the Edge CDN.
Step 5: Reload your webpage. The TTFB will plunge to around 10ms - 50ms. The site load is dramatically improved. This proves the CDN's performance benefit.

3. HOW TO FULFILL THE MIDTERM REQUIREMENT "Demonstrate cache invalidation"
Step 1: Open `index.html` in your text editor.
Step 2: Change line 13 and line 22 from "1.0.0" to "2.0.0".
Step 3: Upload the modified `index.html` file back to your Origin Server.
Step 4: Go to the live website on your browser and refresh.
Step 5: Explain to the grader that the website STILL SAYS "1.0.0". This happens because the Cloudflare Edge Server is actively caching the old file, saving server bandwidth.
Step 6: Go to your Cloudflare Dashboard -> Go to "Caching" -> "Configuration" -> Click the blue button "Purge Everything".
Step 7: Go back to your website and refresh. It will update to "2.0.0" instantly. You have successfully demonstrated Cache Invalidation!

4. HOW TO FULFILL THE MIDTERM REQUIREMENT "Custom Rules (Page Rules)"
Step 1: Go to your Cloudflare Dashboard -> Rules -> Page Rules.
Step 2: Create a rule for `*yourdomain.com/*` or `*yourdomain.com/assets/*`.
Step 3: Set "Cache Level" to "Cache Everything" and Save.
Step 4: Reload your web demo. The dashboard will fire an API check to its own headers. 
Step 5: Explain to the grader that the `CF-Cache-Status` metric on the UI successfully intercepts and shows `HIT` indicating your Custom Page Rule has forcefully cached the output even against default restrictions.

5. TECHNOLOGY USED
- Pure HTML, CSS (Glassmorphism UI), and Vanilla JavaScript ES6+.
- No server languages (No PHP, Node.js) required. This perfectly isolates the network OSI model logic without application-layer interference.
