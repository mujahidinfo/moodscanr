import { Bug, Mail, Megaphone } from 'lucide-react';
import React from 'react';

const contactSections = [
  {
    icon: <Mail className="text-[#A759A3] text-2xl mr-3" />,
    title: 'General Inquiries',
    description: 'Email us at:',
    email: 'info@moodscanr.ai',
  },
  {
    icon: <Bug className="text-[#3EB9E5] text-2xl mr-3" />,
    title: 'Technical Support',
    description: 'Having issues or found a bug? Reach out at:',
    email: 'info@moodscanr.ai',
  },
  {
    icon: <Megaphone className="text-[#F7B801] text-2xl mr-3" />,
    title: 'Press & Partnerships',
    description: 'For media, collaborations, or partnerships:',
    email: 'info@moodscanr.ai',
  },
];

const Page = () => {
  return (
    <section className="flex flex-col items-center min-h-[80vh] py-12 px-4 bg-white">
      <div className="max-w-2xl w-full p-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl md:text-4xl mr-2" role="img" aria-label="mailbox">📬</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black">Contact Us</h1>
        </div>
        <p className="text-base text-gray-700 mb-8">
          We’d love to hear from you! Whether you’re a content creator with feedback, a developer with ideas, or just curious about how MoodScanr works — we’re here to help.
        </p>
        <div className="space-y-6">
          {contactSections.map((section, idx) => (
            <div
              key={section.title}
              className="flex items-start bg-gray-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mt-1">{section.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-[#A759A3] mb-1">{section.title}</h2>
                <p className="text-gray-700 mb-1">{section.description}</p>
                <a
                  href={`mailto:${section.email}`}
                  className="text-[#3EB9E5] font-medium hover:underline break-all"
                >
                  {section.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;