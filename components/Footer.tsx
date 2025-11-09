export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#C8102E]">
              বাংলা নির্বাচন পোর্টাল
            </h3>
            <p className="text-gray-400">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত নির্বাচন তথ্য পোর্টাল
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  হোম
                </a>
              </li>
              <li>
                <a href="#poll" className="hover:text-white transition-colors">
                  পোল
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-white transition-colors">
                  খবর
                </a>
              </li>
            </ul>
          </div>

          {/* Election Info */}
          <div>
            <h4 className="font-bold mb-4">নির্বাচন তথ্য</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  আসনসমূহ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  প্রার্থী তালিকা
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  দলসমূহ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">যোগাযোগ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>ইমেইল: info@electionbd.com</li>
              <li>ফোন: +৮৮০ ১২৩৪৫৬৭৮৯</li>
              <li>ঠিকানা: ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 বাংলা নির্বাচন পোর্টাল। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
