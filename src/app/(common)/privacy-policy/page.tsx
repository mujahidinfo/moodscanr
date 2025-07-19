import React from "react";

const privacySections = [
  {
    title: "1. Information We Collect",
    items: [
      {
        subtitle: "a. Personal Information",
        content: [
          "Provided voluntarily: name, email address, or other contact info when you sign up or contact us.",
        ],
      },
      {
        subtitle: "b. Usage Data",
        content: [
          "Automatically collected: IP address, device/browser type, pages visited, time spent, etc.",
        ],
      },
      {
        subtitle: "c. OAuth & YouTube Data",
        content: [
          "With your consent via Google OAuth, we access:",
          [
            "Channel and live stream metadata (e.g., stream IDs)",
            "Live chat messages (for sentiment analysis)",
            "We only access data necessary to power the sentiment dashboard; we do not store your Google credentials.",
          ],
        ],
      },
      {
        subtitle: "d. Cookies & Tracking",
        content: [
          "We use cookies and similar technologies to enhance your experience, analyse usage, and provide core services.",
        ],
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    items: [
      {
        content: [
          "MoodScanr uses collected data to:",
          [
            "Provide and maintain our service (e.g., live sentiment dashboard)",
            "Process live chat for real-time sentiment analysis",
            "Improve and personalize your experience",
            "Communicate updates, support responses, or marketing (with opt-out option)",
            "Understand usage patterns and site performance",
          ],
        ],
      },
    ],
  },
  {
    title: "3. Sharing Your Information",
    items: [
      {
        content: [
          "We do not sell or rent your personal data. We may share information with:",
          [
            "Trusted service providers (e.g., hosting, analytics)",
            "Legal authorities, as required (e.g., subpoenas, fraud prevention)",
            "Third-party integrations only with your explicit consent",
          ],
        ],
      },
    ],
  },
  {
    title: "4. Your Data Rights",
    items: [
      {
        content: [
          "You may:",
          [
            "Access, correct, or delete your personal data",
            "Opt out of marketing communications",
            "Manage cookie preferences via your browser",
            "Submit data requests by contacting info@moodscanr.ai",
          ],
        ],
      },
    ],
  },
  {
    title: "5. Security Measures",
    items: [
      {
        content: [
          "We implement reasonable security measures to protect your data but cannot guarantee absolute security.",
        ],
      },
    ],
  },
  {
    title: "6. Third-Party Links",
    items: [
      {
        content: [
          "Our site may include links to third-party services (e.g., YouTube). We are not responsible for their privacy practices; please review their policies.",
        ],
      },
    ],
  },
  {
    title: "7. Changes to This Policy",
    items: [
      {
        content: [
          "We reserve the right to update this policy. Continued use after changes means acceptance. We’ll update the “Last Updated” date accordingly.",
        ],
      },
    ],
  },
  {
    title: "8. Contact Us",
    items: [
      {
        content: [
          "For privacy inquiries or requests, contact us:",
          [
            "Email: info@moodscanr.ai",
            "Thank you for trusting MoodScanr with your data!",
          ],
        ],
      },
    ],
  },
];

const intro = [
  "Privacy Policy – MoodScanr.ai",
  "Last Updated: July 2025",
  "MoodScanr (“we,” “us,” or “our”) values your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights when using MoodScanr.",
];

function renderContent(content: (string | string[])[]) {
  return content.map((item, idx) =>
    Array.isArray(item) ? (
      <ul key={idx} className="list-disc list-inside ml-4 text-base text-gray-700 space-y-1">
        {item.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </ul>
    ) : (
      <p key={idx} className="text-base text-gray-700">{item}</p>
    )
  );
}

const PrivacyPolicy = () => {
  return (
    <section className="flex flex-col items-center min-h-[80vh] py-12 px-4 ">
      <div className="max-w-5xl w-full ">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-black">
          Privacy Policy
        </h1>
        <div className="text-sm text-gray-400 mb-6">
          Last Updated: July 2025
        </div>
        <div className="mb-8">
          <p className="text-base text-gray-700">
            MoodScanr (“we,” “us,” or “our”) values your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights when using MoodScanr.
          </p>
        </div>
        <div className="space-y-8">
          {privacySections.map((section, idx) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold mb-2 text-[#A759A3]">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i}>
                    {'subtitle' in item && item.subtitle && (
                      <div className="font-medium text-[#3EB9E5] mb-1">{item.subtitle}</div>
                    )}
                    {renderContent(item.content)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;