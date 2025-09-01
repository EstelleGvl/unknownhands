---
layout: page
title: Contact
permalink: /contact/
---


{% include parallax_image.html src="/assets/img/pizan.jpg" %}




<p style="text-align:center;">Thanks for your visit!</p>


<br>

<section class="contact-card">
  <h2 style="text-align:center;">For inquiries, collaborations, or corrections about the Unknown Hands project, please feel free to reach out here.</h2>
  <br>
  <form id="contact-form" action="https://formspree.io/f/xyzdybkd" method="POST" novalidate>
    <div class="two-col">
      <label>
        First Name
        <input type="text" name="first_name" autocomplete="given-name" required>
      </label>
      <label>
        Last Name
        <input type="text" name="last_name" autocomplete="family-name" required>
      </label>
    </div>
    <label>
      Email Address
      <input type="email" name="email" autocomplete="email" required>
    </label>
    <label>
      Phone
      <input type="tel" name="phone" autocomplete="tel">
    </label>
    <label>
      Type your message here...
      <textarea name="message" rows="6" required></textarea>
    </label>
    <!-- Anti-spam honeypot (kept hidden) -->
    <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-5000px;opacity:0">
    <!-- Optional: set email subject in your inbox -->
    <input type="hidden" name="_subject" value="New message from your website">
    <button class="btn btn-primary" type="submit">Send</button>
    <p id="form-status" class="form-status" aria-live="polite"></p>
  </form>
</section>