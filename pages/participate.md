---
layout: page
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
permalink: /participate/
title: Participate
---

<div class="contact-card" role="form" aria-labelledby="participate-title">
  <h2 id="participate-title">Join the <em>Unknown Hands</em> network</h2>
  <p class="contact-intro">
    Sign up to receive updates, contribute corrections, join working groups, or propose collaborations.
    This is a low-volume list focused on the development of <em>Unknown Hands</em> and related activities.
  </p>

  <!-- Replace YOUR_FORMSPREE_ID with the new Formspree endpoint for this form -->
  <form class="contact-form" action="https://formspree.io/f/xvgbdblv" method="POST">
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

      <label class="form-field">
        <span>Role(s)</span>
        <select name="roles[]" multiple size="5">
            <option>Faculty / Researcher</option>
            <option>Student</option>
            <option>Librarian / Archivist / Curator</option>
            <option>Independent Scholar</option>
            <option>Developer / DH Practitioner</option>
            <option>Other</option>
        </select>
      </label>

      <fieldset class="form-field form-field--full">
        <legend>Areas of interest</legend>
        <label><input type="checkbox" name="areas[]" value="Female scribes"> Female scribes</label>
        <label><input type="checkbox" name="areas[]" value="Codicology"> Codicology</label>
        <label><input type="checkbox" name="areas[]" value="Paleography"> Paleography</label>
        <label><input type="checkbox" name="areas[]" value="Metadata/Standards"> Metadata &amp; standards</label>
        <label><input type="checkbox" name="areas[]" value="Visualization/Maps"> Visualization &amp; maps</label>
        <label><input type="checkbox" name="areas[]" value="Teaching resources"> Teaching resources</label>
        <label><input type="checkbox" name="areas[]" value="Other"> Other</label>
      </fieldset>

      <fieldset class="form-field form-field--full">
        <legend>How would you like to be involved?</legend>
        <label><input type="checkbox" name="involvement[]" value="Updates"> Receive project updates (mailing list)</label>
        <label><input type="checkbox" name="involvement[]" value="Corrections"> Contribute corrections/additions</label>
        <label><input type="checkbox" name="involvement[]" value="Working group"> Join a working group</label>
        <label><input type="checkbox" name="involvement[]" value="Meetings"> Attend virtual meetings/workshops</label>
        <label><input type="checkbox" name="involvement[]" value="Collaboration"> Propose collaborations</label>
      </fieldset>

      <label class="form-field form-field--full">
        <span>Notes (optional)</span>
        <textarea name="notes" rows="6" placeholder="Share specific interests, ideas, or corrections you’d like us to consider."></textarea>
      </label>

      <label class="form-field form-field--full">
        <input type="checkbox" name="consent" value="yes" required>
        <span>I agree to be contacted about <em>Unknown Hands</em> updates and opportunities.</span>
      </label>
    </div>

    <!-- Honeypot (spam protection) -->
    <label class="visually-hidden">Leave this field empty
      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off">
    </label>

    <!-- Email subject + redirect -->
    <input type="hidden" name="_subject" value="[Unknown Hands] New participation form">
    <input type="hidden" name="_next" value="{{ '/contact/thanks/' | relative_url }}">

    <button type="submit" class="btn-primary">Sign up</button>
    <p class="contact-privacy">
      We store your details securely and do not share them. You can request deletion at any time.
    </p>
  </form>
</div>