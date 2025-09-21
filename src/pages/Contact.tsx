import React from 'react';
const Contact = () => {
  return <div>
      <h1 className="text-2xl font-headline font-medium mb-6">Contact Us</h1>
      <div className="border-t border-gray-200 pt-6">
        <p className="mb-6">
          Have questions about using Applicants.IO? We're here to help. Fill out
          the form below and we'll get back to you as soon as possible.
        </p>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block mb-1">
              Subject
            </label>
            <input type="text" id="subject" className="w-full px-3 py-2 border border-gray-300 focus:outline-none" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-1">
              Message
            </label>
            <textarea id="message" rows={6} className="w-full px-3 py-2 border border-gray-300 focus:outline-none"></textarea>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white border border-blue-600">
            Send Message
          </button>
        </form>
      </div>
    </div>;
};
export default Contact;