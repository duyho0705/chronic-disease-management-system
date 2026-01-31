import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Calendar,
  activity as Activity,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  Star,
  Heart,
  Stethoscope,
  Microscope,
  Shield,
  PlayCircle,
  Check
} from 'lucide-react'

// CustomSelect Component
// CustomSelect Component
interface CustomSelectProps {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string; // Kept for compatibility but might default to options[0]
}

function CustomSelect({ options, defaultValue, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className={`w-full bg-slate-50 border border-transparent rounded-xl py-3 px-4 text-slate-900 font-medium flex items-center justify-between transition-all duration-200 ${isOpen ? 'bg-white ring-2 ring-blue-500 shadow-md' : 'hover:bg-blue-50/50 hover:border-blue-200'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedValue}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-xl border border-slate-100 max-h-60 overflow-auto custom-scrollbar focus:outline-none"
          >
            {options.map((option) => (
              <li
                key={option}
                className={`relative cursor-pointer select-none py-2.5 pl-4 pr-10 text-sm transition-colors ${option === selectedValue ? 'bg-blue-50/50 text-blue-600 font-medium' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                onClick={() => handleSelect(option)}
              >
                <span className="block truncate">{option}</span>
                {option === selectedValue && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-200 shadow-lg">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Modern<span className="text-blue-600">Clinic</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="#">Chuyên Khoa</NavLink>
            <NavLink to="#">Bác Sĩ</NavLink>
            <NavLink to="#">Công Nghệ</NavLink>
            <NavLink to="#">Cổng Bệnh Nhân</NavLink>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đặt Lịch Khám
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 sm:pt-40 sm:pb-40 bg-slate-50 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[600px] w-[600px] rounded-full bg-blue-50 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[400px] w-[400px] rounded-full bg-teal-50 blur-3xl opacity-50"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-6">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                Chăm Sóc Sức Khỏe Tin Cậy
              </div>
              <h1 className="leading-tight text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6">
                An Tâm Tuyệt Đối Về <span className="text-blue-600">Sức Khỏe Gia Đình</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg text-slate-600 leading-relaxed mb-8">
                Trải nghiệm sự chăm sóc tận tâm và chuyên môn y tế tiên tiến tại cơ sở hiện đại của chúng tôi. Chúng tôi tập trung vào việc chữa lành bằng cả trái tim.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200"
                >
                  Đặt Lịch Ngay
                </Link>
                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300">
                  <PlayCircle className="h-5 w-5 text-slate-900" />
                  Tham Quan Ảo
                </button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-[500px] lg:max-w-none">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                    alt="Doctor with tablet"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-float">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">99%</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Hài Lòng Bệnh Nhân</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Booking Bar */}
        <div className="mt-20 px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 sm:p-6 lg:translate-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Chuyên Khoa</label>
                <CustomSelect
                  options={['Tim Mạch', 'Nhi Khoa', 'Da Liễu', 'Tổng Quát', 'Thần Kinh', 'Cơ Xương Khớp']}
                  placeholder="Chọn chuyên khoa"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Bác Sĩ</label>
                <CustomSelect
                  options={['Bất kỳ Bác sĩ nào', 'BS. Nguyễn Văn A', 'BS. Trần Thị B', 'BS. Lê Văn C', 'BS. Phạm Thị D']}
                  placeholder="Chọn bác sĩ"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Ngày Khám</label>
                <div className="relative group">
                  <input
                    type="date"
                    className="w-full bg-slate-50 border border-transparent rounded-xl py-3 px-4 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all hover:bg-blue-50/50 cursor-pointer"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group">
                  <span className="relative z-10">Kiểm Tra Lịch</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="pt-32 pb-12 bg-white border-b border-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Được tin tưởng bởi các tổ chức y tế hàng đầu</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos - In production use real SVGs */}
            <div className="h-8 font-bold text-xl text-slate-600 flex items-center gap-2"><Shield className="h-6 w-6" /> MEDGROUP</div>
            <div className="h-8 font-bold text-xl text-slate-600 flex items-center gap-2"><Heart className="h-6 w-6" /> CAREPLUS</div>
            <div className="h-8 font-bold text-xl text-slate-600 flex items-center gap-2"><Activity className="h-6 w-6" /> HEALTHVIET</div>
            <div className="h-8 font-bold text-xl text-slate-600 flex items-center gap-2"><PlayCircle className="h-6 w-6" /> VINMEC</div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Chuyên Khoa Mũi Nhọn</h2>
              <p className="text-lg text-slate-500">Chúng tôi cung cấp đa dạng các dịch vụ y tế được thực hiện bởi các chuyên gia hàng đầu cùng trang thiết bị chẩn đoán hiện đại nhất.</p>
            </div>
            <a href="#" className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 hover:gap-2 transition-all group">
              Xem Tất Cả Dịch Vụ
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <SpecialtyCard
              icon={<Heart className="w-8 h-8 text-blue-600" />}
              title="Tim Mạch"
              desc="Chăm sóc sức khỏe tim mạch toàn diện từ phòng ngừa đến các thủ thuật phẫu thuật phức tạp."
            />
            <SpecialtyCard
              icon={<Stethoscope className="w-8 h-8 text-blue-600" />}
              title="Nhi Khoa"
              desc="Nuôi dưỡng thế hệ tương lai với dịch vụ chăm sóc chuyên biệt cho trẻ sơ sinh, trẻ em và thanh thiếu niên."
            />
            <SpecialtyCard
              icon={<Microscope className="w-8 h-8 text-blue-600" />}
              title="Chẩn Đoán"
              desc="Phòng xét nghiệm chính xác cung cấp kết quả nhanh chóng và chuẩn xác cho quy trình điều trị hiệu quả."
            />
            <SpecialtyCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Y Học Dự Phòng"
              desc="Theo dõi sức khỏe hàng ngày và khám sàng lọc định kỳ để giúp bạn luôn khỏe mạnh và năng động."
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-teal-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Tại Sao Chọn ModernClinic?</h2>
              <p className="text-lg text-slate-600 mb-10">Chúng tôi kết hợp công nghệ tiên tiến với phương pháp lấy con người làm trung tâm để cung cấp dịch vụ y tế chất lượng cao nhất. Sứ mệnh của chúng tôi là làm cho việc chăm sóc sức khỏe trở nên dễ tiếp cận, hiệu quả và mang tính cá nhân sâu sắc.</p>

              <div className="space-y-6">
                <BenefitCard
                  icon={<Microscope className="w-5 h-5 text-teal-600" />}
                  title="Công Nghệ Hiện Đại"
                  desc="Trang bị các công cụ chẩn đoán và phẫu thuật mới nhất cho y học chính xác."
                  iconBg="bg-teal-100"
                />
                <BenefitCard
                  icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
                  title="Đội Ngũ Chuyên Gia"
                  desc="Các bác sĩ chuyên khoa được chứng nhận với hàng chục năm kinh nghiệm trong nhiều lĩnh vực."
                  iconBg="bg-blue-100"
                />
                <BenefitCard
                  icon={<Heart className="w-5 h-5 text-red-600" />}
                  title="Triết Lý Lấy Bệnh Nhân Làm Đầu"
                  desc="Chăm sóc cá nhân hóa phù hợp với hành trình sức khỏe và tiền sử gia đình của bạn."
                  iconBg="bg-red-100"
                />
              </div>
            </div>

            {/* Bento Grid Images */}
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[500px]">
              <div className="col-span-2 row-span-1 relative overflow-hidden rounded-3xl shadow-lg group">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Sảnh bệnh viện" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-semibold">Cơ sở vật chất chuẩn Quốc tế</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-lg group">
                <img src="https://images.unsplash.com/photo-1576091160550-2187580018f7?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bác sĩ" />
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-lg bg-blue-600 flex items-center justify-center p-6 text-white text-center group">
                <div>
                  <p className="text-4xl font-bold mb-2">15+</p>
                  <p className="text-sm font-medium opacity-90">Năm Kinh Nghiệm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Cảm Nhận Từ Bệnh Nhân</h2>
            <p className="mt-4 text-lg text-slate-600">Câu chuyện thật từ những người đã tin tưởng trao gửi sức khỏe cho chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Nguyễn Thị Lan"
              role="Bệnh nhân từ 2021"
              text="Mức độ chăm sóc tôi nhận được vượt xa sự mong đợi. Cơ sở vật chất hiện đại, và nhân viên thực sự lắng nghe những lo lắng của bạn. Rất khuyến khích!"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
            />
            <TestimonialCard
              name="Trần Văn Minh"
              role="Bệnh nhân từ 2019"
              text="Hiệu quả, chuyên nghiệp và rất thân thiện. Việc đặt lịch trực tuyến làm mọi thứ trở nên dễ dàng. Tôi đánh giá cao chuyên môn của đội ngũ tim mạch."
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
            />
            <TestimonialCard
              name="Phạm Thanh Hà"
              role="Mẹ của 3 bé"
              text="Khu khám nhi thật tuyệt vời. Các con tôi thực sự hào hứng khi đến gặp bác sĩ. Cảm ơn vì đã tạo ra một môi trường ấm áp như vậy!"
              avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
            />
          </div>
        </div>
      </section>

      {/* Footer Location Section */}
      <section className="relative h-[500px] w-full bg-slate-100 overflow-hidden">
        {/* Map Background Placeholder */}
        <div className="absolute inset-0 grayscale opacity-80"
          style={{
            backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/1200x500?access_token=Pk.YOUR_TOKEN')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#e5e7eb' // Fallback
          }}>
          {/* Grid for visual if map doesn't load */}
          <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-center lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Liên Hệ</h3>
            <p className="text-slate-600 mb-6">Chúng tôi tọa lạc thuận tiện ngay trung tâm thành phố với bãi đậu xe rộng rãi.</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Medical Center Plaza</p>
                  <p className="text-sm text-slate-500">123 Đại Lộ Sức Khỏe, Quận 1, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">1900 123 456</p>
                  <p className="text-sm text-slate-500">Cấp cứu 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">T2 - T6: 8:00 - 20:00</p>
                  <p className="text-sm text-slate-500">T7: 9:00 - 14:00, CN: Nghỉ</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Chỉ Đường
            </button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-white">Modern<span className="text-blue-500">Clinic</span></span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Cung cấp dịch vụ y tế đẳng cấp quốc tế từ năm 2005. Cam kết vì sức khỏe cộng đồng và đổi mới công nghệ.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Liên Kết Nhanh</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Chuyên Khoa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tìm Bác Sĩ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cổng Bệnh Nhân</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển Dụng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Tài Nguyên</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Thông Tin Bảo Hiểm</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Thanh Toán Trực Tuyến</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hồ Sơ Y Tế</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Câu Hỏi Thường Gặp</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Đăng Ký Tin</h4>
              <p className="text-xs text-slate-400 mb-4">Nhận cập nhật các mẹo sức khỏe mới nhất.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email của bạn" className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; 2024 ModernClinic Medical Group. Bảo lưu mọi quyền.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white">Chính Sách Bảo Mật</a>
              <a href="#" className="hover:text-white">Điều Khoản Sử Dụng</a>
              <a href="#" className="hover:text-white">Trợ Giúp</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
      {children}
    </Link>
  )
}

function SpecialtyCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 group">
      <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="h-1 w-12 bg-blue-200 rounded-full group-hover:w-20 group-hover:bg-blue-600 transition-all"></div>
    </div>
  )
}

function BenefitCard({ icon, title, desc, iconBg }: { icon: React.ReactNode, title: string, desc: string, iconBg: string }) {
  return (
    <div className="flex gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-12 w-12 shrink-0 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ name, role, text, avatar }: { name: string, role: string, text: string, avatar: string }) {
  return (
    <div className="bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
      <div className="flex gap-1 text-amber-400 mb-4">
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
      </div>
      <p className="text-slate-700 italic mb-6 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
