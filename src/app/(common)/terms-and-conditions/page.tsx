import React from "react";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    items: [
      {
        content: [
          "By accessing or using MoodScanr, you confirm:",
          [
            "You are legally able to enter into this agreement.",
            "You have read, understood, and agree to abide by these Terms and our Privacy Policy.",
          ],
        ],
      },
    ],
  },
  {
    title: "2. Service Access & Eligibility",
    items: [
      {
        content: [
          [
            "MoodScanr is for users 18+ (or minors with parental consent).",
            "We may restrict or suspend accounts that violate these Terms.",
          ],
        ],
      },
    ],
  },
  {
    title: "3. User Accounts & Authentication",
    items: [
      {
        content: [
          [
            "You may need to create an account and log in using Google OAuth to connect your YouTube channel.",
            "You are responsible for maintaining the confidentiality of your account and access credentials.",
          ],
        ],
      },
    ],
  },
  {
    title: "4. Your Content & YouTube Data",
    items: [
      {
        content: [
          [
            "You grant MoodScanr permission to access your live stream metadata and chat messages via the YouTube API.",
            "You retain ownership of content; MoodScanr collects, analyses, and stores only necessary data for sentiment analysis.",
          ],
        ],
      },
    ],
  },
  {
    title: "5. User Conduct",
    items: [
      {
        content: [
          "You must not:",
          [
            "Use MoodScanr for unlawful or harmful purposes.",
            "Interfere with the Service or reverse engineer it.",
            "Bypass platform limitations or access controls.",
            "Upload malware or spam through the Service.",
          ],
        ],
      },
    ],
  },
  {
    title: "6. Fees & Payment",
    items: [
      {
        content: [
          [
            "Free tier: Our core sentiment analysis tool is free to use — no cancellation needed.",
            "Future paid plans: If introduced, payment terms and refunds will be detailed in the applicable subscription agreement.",
          ],
        ],
      },
    ],
  },
  {
    title: "7. Privacy & Data Processing",
    items: [
      {
        content: [
          [
            "MoodScanr handles personal and YouTube data in accordance with our Privacy Policy.",
            "We implement reasonable technical and organizational security measures.",
            "You control post-stream data access or deletion requests.",
          ],
        ],
      },
    ],
  },
  {
    title: "8. Intellectual Property",
    items: [
      {
        content: [
          [
            "MoodScanr owns all IP rights related to the Service, including software, branding, and visual design.",
            "You grant MoodScanr a license to use your submitted data solely for providing the Service.",
          ],
        ],
      },
    ],
  },
  {
    title: "9. Disclaimers & Warranties",
    items: [
      {
        content: [
          [
            "\"As is\" basis: We provide the Service without warranties of uninterrupted access or accuracy of sentiment results.",
            "Use the sentiment dashboard at your own risk — it's for assistance, not professional decision-making.",
          ],
        ],
      },
    ],
  },
  {
    title: "10. Limitation of Liability",
    items: [
      {
        content: [
          [
            "MoodScanr and its partners will not be liable for indirect, incidental, special, or consequential damages.",
            "Our total liability will not exceed any fees you've paid in the 12 months prior (or £100 if no fees have been collected).",
          ],
        ],
      },
    ],
  },
  {
    title: "11. Indemnification",
    items: [
      {
        content: [
          "You agree to defend and indemnify MoodScanr against any claims arising from your use of the Service or violation of these Terms.",
        ],
      },
    ],
  },
  {
    title: "12. Termination",
    items: [
      {
        content: [
          [
            "Either party may terminate your access at any time, without notice.",
            "You may stop using the Service at any time — if you return later, new Terms may apply.",
          ],
        ],
      },
    ],
  },
  {
    title: "13. Governing Law",
    items: [
      {
        content: [
          [
            "These Terms are governed by the laws of England & Wales.",
            "Any disputes will be resolved in English courts or via arbitration with your consent.",
          ],
        ],
      },
    ],
  },
  {
    title: "14. Changes to Terms",
    items: [
      {
        content: [
          "We may revise these Terms occasionally. Continued use of MoodScanr after changes means you accept them. We'll notify you of major updates.",
        ],
      },
    ],
  },
  {
    title: "15. Contact Us",
    items: [
      {
        content: [
          "Questions? Reach out to us at:",
          [
            "Email: info@moodscanr.ai",
          ],
        ],
      },
    ],
  },
];

const intro = [
  "Terms & Conditions – MoodScanr.ai",
  "Last Updated: July 2025",
  "Welcome to MoodScanr (\"we\", \"us\", \"our\"). These Terms and Conditions govern your access to and use of our website and services at moodscanr.ai (\"Service\"). By using our Service, you agree to be bound by these Terms. If you disagree, please do not use MoodScanr.",
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

const TermsAndConditions = () => {
  return (
    <section className="flex flex-col items-center min-h-[80vh] py-12 px-4 ">
      <div className="max-w-5xl w-full ">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-black">
          Terms & Conditions
        </h1>
        <div className="text-sm text-gray-400 mb-6">
          Last Updated: July 2025
        </div>
        <div className="mb-8">
          <p className="text-base text-gray-700">
            Welcome to MoodScanr ("we", "us", "our"). These Terms and Conditions govern your access to and use of our website and services at moodscanr.ai ("Service"). By using our Service, you agree to be bound by these Terms. If you disagree, please do not use MoodScanr.
          </p>
        </div>
        <div className="space-y-8">
          {termsSections.map((section, idx) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold mb-2 text-[#A759A3]">{section.title}</h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i}>
                                         {'subtitle' in item && (item as any).subtitle && (
                       <div className="font-medium text-[#3EB9E5] mb-1">{(item as any).subtitle}</div>
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

export default TermsAndConditions;