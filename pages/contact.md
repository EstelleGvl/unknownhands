---
layout: page
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
permalink: /contact/
---

<div class="contact-card" role="form" aria-labelledby="contact-title">
  <h2 id="contact-title">Get in touch</h2>
  <p class="contact-intro">
    For inquiries, collaborations, or corrections to records, use the form below.
    Please include shelfmarks or citations where relevant.
  </p>

  <form class="contact-form" action="https://formspree.io/f/xldwlonz" method="POST">
    <!-- Accessibility-friendly labels -->
    <div class="form-grid">
      <label class="form-field">
        <span>First name</span>
        <input type="text" name="first_name" autocomplete="given-name" required>
      </label>
      <label class="form-field">
        <span>Last name</span>
        <input type="text" name="last_name" autocomplete="family-name" required>
      </label>
      <label class="form-field">
        <span>Email</span>
        <input type="email" name="_replyto" autocomplete="email" required>
      </label>
      <label class="form-field">
        <span>Affiliation (optional)</span>
        <input type="text" name="affiliation" autocomplete="organization">
      </label>
      <label class="form-field form-field--full">
        <span>Message</span>
        <textarea name="message" rows="6" required placeholder="What would you like to share or correct?"></textarea>
      </label>
    </div>
    <!-- Honeypot (spam protection) -->
    <label class="visually-hidden">Leave this field empty
      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off">
    </label>
    <!-- After-submit redirect (optional) -->
    <input type="hidden" name="_subject" value="[Unknown Hands] New message">
    <input type="hidden" name="_next" value="{{ '/contact/thanks/' | relative_url }}">
    <button type="submit" class="btn-primary">Send message</button>
    <p class="contact-privacy">By sending this form you consent to being contacted about your message. We do not share your details.</p>
  </form>
</div>