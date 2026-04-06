import LegalLayout from "@/components/landing/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="April 6, 2026">
      <p>
        Santhica ("we," "us," or "our") is committed to protecting the privacy
        and security of your personal information. This Privacy Policy describes
        how we collect, use, store, and protect information when you use the
        Santhica mobile application (the "App").
      </p>
      <p>
        By using Santhica, you agree to the collection and use of information in
        accordance with this policy.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        <strong>Patient Data:</strong> Names, dates of birth, contact
        information, medical diagnoses, prescribed medications (including name,
        dosage, frequency, and duration), and follow-up instructions entered or
        captured through the App.
      </p>
      <p>
        <strong>Prescription Images:</strong> Photographs of handwritten or
        printed prescriptions captured via the device camera for AI-powered OCR
        processing.
      </p>
      <p>
        <strong>Device Information:</strong> Device model, operating system
        version, and app version for troubleshooting and compatibility purposes.
      </p>
      <p>
        <strong>Usage Data:</strong> Anonymized, non-identifiable usage
        statistics such as feature usage frequency and session duration. No
        personally identifiable information (PII) is included in usage logs.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>
          To digitize handwritten prescriptions using AI-powered OCR (optical
          character recognition)
        </li>
        <li>
          To organize and store patient records and visit histories on your
          device
        </li>
        <li>
          To provide structured medication data (diagnosis, medications, dosage,
          frequency, duration)
        </li>
        <li>To enable CSV export of prescription records</li>
        <li>To improve and optimize the App's performance and accuracy</li>
      </ul>

      <h2>3. AI Processing & OCR</h2>
      <p>
        Prescription images are processed using OpenAI's GPT model to extract
        structured medical data. Images are transmitted securely to OpenAI's API
        for processing. We do not store prescription images on external servers
        beyond the time required for processing. The extracted data is returned
        to your device and stored locally.
      </p>
      <p>
        OpenAI's data usage policies apply to image processing. We recommend
        reviewing <strong>OpenAI's Privacy Policy</strong> for details on how
        they handle data transmitted through their API.
      </p>

      <h2>4. Data Storage & Security</h2>
      <p>
        <strong>On-Device Storage:</strong> All patient data, prescription
        records, and extracted medical information are stored locally on your
        device with encryption.
      </p>
      <p>
        <strong>API Key Security:</strong> Your OpenAI API key is stored
        securely in the iOS Keychain and is never transmitted or logged.
      </p>
      <p>
        <strong>Biometric Authentication:</strong> The App supports Face ID and
        Touch ID to prevent unauthorized access to patient records.
      </p>
      <p>
        <strong>Database Encryption:</strong> The local database is encrypted at
        rest to protect sensitive medical information.
      </p>
      <p>
        <strong>PII-Filtered Logging:</strong> All application logs are filtered
        to exclude personally identifiable information.
      </p>
      <p>
        <strong>Audit Trails:</strong> The App maintains audit trails for
        medical compliance, recording when records are created, modified, or
        accessed.
      </p>

      <h2>5. Data Sharing & Third Parties</h2>
      <p>
        We do not sell, rent, or share your personal information or patient data
        with any third parties, except:
      </p>
      <ul>
        <li>
          <strong>OpenAI API:</strong> Prescription images are transmitted to
          OpenAI for OCR processing as described in Section 3
        </li>
        <li>
          <strong>Legal Requirements:</strong> We may disclose information if
          required by law, regulation, or valid legal process
        </li>
        <li>
          <strong>SMS Opt-In Data:</strong> Mobile information will not be shared
          with third parties/affiliates for marketing/promotional purposes. All
          the above categories exclude text messaging originator opt-in data and
          consent; this information will not be shared with any third parties.
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        All data is stored locally on your device. You may delete individual
        patient records or all data at any time through the App. Uninstalling
        the App will remove all locally stored data. We do not retain any
        patient data on external servers.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access all patient data stored in the App</li>
        <li>Correct or update any patient records</li>
        <li>Delete individual records or all data from the App</li>
        <li>Export your data in CSV format</li>
        <li>
          Withdraw consent for AI processing by discontinuing use of the capture
          feature
        </li>
      </ul>

      <h2>8. Children's Privacy</h2>
      <p>
        Santhica is designed for use by licensed medical professionals. We do
        not knowingly collect information from individuals under the age of 18.
        The App is intended for use by qualified doctors and healthcare
        practitioners.
      </p>

      <h2>9. International Users</h2>
      <p>
        While Santhica is primarily designed for Indian clinicians, the App is
        available worldwide. If you are using the App outside of India, please
        note that prescription images are processed through OpenAI's API, which
        may involve data transfer to servers located in the United States or
        other jurisdictions. By using the App, you consent to such data transfer
        for the purpose of prescription processing.
      </p>

      <h2>10. Compliance</h2>
      <p>
        Santhica is designed with compliance in mind for Indian medical
        regulations, including the Information Technology Act, 2000 and the
        Digital Personal Data Protection Act, 2023 (DPDP Act). We implement
        reasonable security practices and procedures as required under
        applicable Indian law.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        reflected in the "Last updated" date at the top of this page. Continued
        use of the App after changes constitutes acceptance of the updated
        policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or our
        data practices, please contact us at:
      </p>
      <p>
        <strong>Email:</strong> support@santhica.com
      </p>
    </LegalLayout>
  );
}
