import React, { ReactNode, useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Search,
  Users,
  BedDouble,
  Bed,
  Maximize2,
  Wifi,
  AirVent,
  Tv,
  Bath,
  Clock,
  Check,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  QrCode,
  Printer,
  Sparkles,
  Coffee,
  Car,
  SlidersHorizontal,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Edit3,
  AlertTriangle,
  Heart,
  Info,
  Eye,
  RefreshCw,
  MessageSquare,
  ChevronUp,
  Lock,
} from "lucide-react"
import {
  Booking,
  Customer,
  IMG,
  NavParams,
  RoomType,
  Store,
  TODAY,
  View,
  addDays,
  availableRooms,
  fmtDate,
  nightsBetween,
  totalOf,
  typeOf,
  vnd,
  weekday,
} from "./data"
import { Avatar, Brand, ConfirmDialog } from "./ui"
import { ChangeDatesModal } from "./admin"

export interface CCtx {
  store: Store
  me: Customer
  go: (v: View, p?: NavParams) => void
  notify: (s: string) => void
  logout: () => void
}

/* ─────────────────────────────────────────────────────────────
   ADD-ONS & REVIEWS MOCK DATA
   ───────────────────────────────────────────────────────────── */

interface AddOnOption {
  id: string
  name: string
  desc: string
  price: number
  isPerNight?: boolean
  icon: React.ElementType
}

const ADDON_OPTIONS: AddOnOption[] = [
  {
    id: "breakfast",
    name: "Buffet sáng quốc tế cao cấp",
    desc: "Thực đơn Á - Âu thay đổi mỗi ngày tại nhà hàng tầng 15 với view toàn cảnh thành phố.",
    price: 150000,
    isPerNight: true,
    icon: Coffee,
  },
  {
    id: "airport",
    name: "Xe riêng đón/tiễn sân bay Tân Sơn Nhất",
    desc: "Xe Sedan cao cấp 4 chỗ đón tại sảnh đến quốc tế/quốc nội, nước suối và khăn lạnh.",
    price: 350000,
    isPerNight: false,
    icon: Car,
  },
  {
    id: "early_checkin",
    name: "Đảm bảo nhận phòng sớm (từ 10:00)",
    desc: "Ưu tiên phòng sạch sớm hơn 4 tiếng so với giờ quy định để bạn nghỉ ngơi trọn vẹn.",
    price: 200000,
    isPerNight: false,
    icon: Clock,
  },
  {
    id: "spa_wellness",
    name: "Gói trị liệu thư giãn 60 phút",
    desc: "Massage thảo mộc cổ truyền hoặc liệu trình đá nóng tại Havenly Spa & Wellness.",
    price: 450000,
    isPerNight: false,
    icon: Sparkles,
  },
]

const SAMPLE_REVIEWS: Record<string, {
  author: string
  date: string
  rating: number
  title: string
  content: string
}[]> = {
  standard: [
    {
      author: "Trần Minh Hoàng",
      date: "12/05/2025",
      rating: 5,
      title: "Yên tĩnh và cực kỳ sạch sẽ",
      content:
        "Phòng tuy nhỏ gọn nhưng bố trí thông minh, cách âm tốt. Giường rất êm giúp mình ngủ ngon sau ngày dài công tác.",
    },
    {
      author: "Nguyễn Bích Ngọc",
      date: "28/04/2025",
      rating: 4.8,
      title: "Giá hợp lý ngay trung tâm",
      content:
        "Đi bộ ra phố đi bộ chỉ 5 phút. Nhân viên lễ tân chu đáo, nhiệt tình hỗ trợ gửi hành lý sớm.",
    },
  ],
  superior: [
    {
      author: "Lê Thảo Vy",
      date: "02/06/2025",
      rating: 5,
      title: "Cửa sổ lớn đón nắng sáng tuyệt vời",
      content:
        "Căn phòng thoáng đãng, bàn làm việc thoải mái có đủ ổ cắm điện. Tầm nhìn ra đường sách và nhà thờ rất đẹp.",
    },
    {
      author: "Võ Đức Khang",
      date: "18/05/2025",
      rating: 4.9,
      title: "Dịch vụ buồng phòng xuất sắc",
      content:
        "Mọi thứ từ khăn tắm đến ga đệm đều thơm mùi cỏ hoa nhẹ nhàng. Rất đáng trải nghiệm.",
    },
  ],
  deluxe: [
    {
      author: "Phạm Hoàng Nam",
      date: "20/06/2025",
      rating: 5,
      title: "Bồn tắm thư giãn đỉnh cao",
      content:
        "Phòng tắm rộng và thiết kế đá vân mây sang trọng. Sau ngày làm việc mệt mỏi được ngâm bồn nước ấm là điểm 10.",
    },
    {
      author: "Bùi Mai Phương",
      date: "10/06/2025",
      rating: 5,
      title: "Nội thất gỗ ấm cúng và tinh tế",
      content:
        "Phong cách thiết kế rất có gu, không hề bị rập khuôn. Bữa sáng tại nhà hàng trên cao nhiều món tươi ngon.",
    },
  ],
  suite: [
    {
      author: "Đỗ Ngọc Linh",
      date: "15/06/2025",
      rating: 5,
      title: "Kỳ nghỉ gia đình hoàn hảo",
      content:
        "Không gian phòng khách tách biệt rất tiện khi tiếp bạn bè hoặc cho con nhỏ vui chơi. View ngắm hoàng hôn thành phố ngoạn mục.",
    },
    {
      author: "Hoàng Gia Bảo",
      date: "01/06/2025",
      rating: 5,
      title: "Đẳng cấp 5 sao đúng nghĩa",
      content:
        "Mọi tiểu tiết từ máy pha cà phê Nespresso đến âm thanh loa Marshall trong phòng đều chỉn chu. Gia đình tôi chắc chắn sẽ quay lại.",
    },
  ],
}

/* ─────────────────────────────────────────────────────────────
   PORTAL SHELL (NAVIGATION, HEADER, FOOTER)
   ───────────────────────────────────────────────────────────── */

export function PortalShell({
  ctx,
  view,
  children,
  wide = false,
}: {
  ctx: CCtx
  view: View
  children: ReactNode
  wide?: boolean
}) {
  const { go, me, logout } = ctx
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems: { view: View; label: string; icon: React.ElementType }[] = [
    { view: "portal", label: "Khám phá phòng", icon: Search },
    { view: "my-bookings", label: "Kỳ nghỉ của tôi", icon: Calendar },
    { view: "support", label: "Hỗ trợ khách hàng", icon: HelpCircle },
    { view: "profile", label: "Hồ sơ cá nhân", icon: UserIcon },
  ]

  const isNavActive = (v: View) =>
    view === v ||
    (v === "portal" && ["room-detail", "checkout", "success"].includes(view))

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1c2d27] flex flex-col font-sans selection:bg-[#168c8a]/20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e6ecf0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand */}
          <button
            onClick={() => go("portal")}
            className="flex items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#168c8a] rounded-lg p-1 transition-transform active:scale-98"
            aria-label="Havenly Hotel - Trang chủ"
          >
            <Brand />
          </button>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Điều hướng chính"
          >
            {navItems.map((item) => {
              const active = isNavActive(item.view)
              return (
                <button
                  key={item.view}
                  onClick={() => go(item.view)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
                    active
                      ? "bg-[#0f2b46] text-white shadow-xs font-semibold"
                      : "text-[#475a6c] hover:text-[#0f2b46] hover:bg-[#f1f5f9]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switch to Admin */}
            <button
              onClick={() => go("dashboard")}
              title="Chuyển sang góc nhìn Quản trị viên"
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#66788a] hover:text-[#0f2b46] px-3 py-1.5 rounded-md border border-[#e4eaf0] hover:bg-[#f8fafc] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#168c8a]" />
              <span>Góc nhìn Admin</span>
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#e4eaf0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc] transition-all focus-visible:outline-2 focus-visible:outline-[#168c8a]"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <Avatar name={me.name} size={32} />
                <span className="hidden sm:inline-block text-xs font-medium text-[#1b2c3c] max-w-[120px] truncate">
                  {me.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#66788a] hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-[#e4eaf0] p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b border-[#f1f5f9] mb-1">
                      <p className="text-xs text-[#66788a]">
                        Đang đăng nhập với tư cách
                      </p>
                      <p className="text-sm font-semibold text-[#0f2b46] truncate">
                        {me.name}
                      </p>
                      <p className="text-xs text-[#94a3b8] truncate">
                        {me.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        go("profile")
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#334155] rounded-lg hover:bg-[#f8fafc] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#168c8a]" />
                      <span>Hồ sơ & Bảo mật</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        go("my-bookings")
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#334155] rounded-lg hover:bg-[#f8fafc] transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#d5a447]" />
                      <span>Kỳ nghỉ của tôi</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        go("support")
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#334155] rounded-lg hover:bg-[#f8fafc] transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-[#66788a]" />
                      <span>Trung tâm trợ giúp</span>
                    </button>

                    <div className="my-1 border-t border-[#f1f5f9]" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#c94848] rounded-lg hover:bg-[#fbecec] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
          wide ? "max-w-7xl" : "max-w-5xl"
        }`}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e4eaf0] z-40 px-2 py-2 flex items-center justify-around shadow-lg"
        aria-label="Điều hướng di động"
      >
        {navItems.map((item) => {
          const active = isNavActive(item.view)
          return (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                active
                  ? "text-[#0f2b46] font-semibold"
                  : "text-[#64748b] hover:text-[#0f2b46]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  active ? "text-[#168c8a]" : "text-[#94a3b8]"
                }`}
              />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e6ecf0] mt-auto py-12 text-[#475a6c] pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <Brand />
              <p className="text-xs leading-relaxed max-w-md text-[#64748b]">
                Havenly Hotel & Resort — Điểm dừng chân thanh bình giữa lòng
                thành phố, nơi hòa quyện giữa kiến trúc đương đại tinh tế và
                lòng hiếu khách chân thành.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#0f2b46] pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#168c8a]" />
                  27 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#168c8a]" />
                  028 3822 1188
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#0f2b46] tracking-wider uppercase mb-3">
                Thông tin lưu trú
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <span className="text-[#64748b]">Giờ nhận phòng:</span> từ
                  14:00
                </li>
                <li>
                  <span className="text-[#64748b]">Giờ trả phòng:</span> trước
                  12:00
                </li>
                <li>
                  <span className="text-[#64748b]">Bữa sáng buffet:</span> 06:30
                  – 10:00
                </li>
                <li>
                  <span className="text-[#64748b]">Hồ bơi vô cực:</span> 06:00 –
                  21:00
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#0f2b46] tracking-wider uppercase mb-3">
                Cam kết chất lượng
              </h4>
              <ul className="space-y-2 text-xs text-[#64748b]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#168c8a]" />
                  Giá niêm yết đã bao gồm thuế & phí
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#168c8a]" />
                  Hủy phòng linh hoạt không mất phí
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#168c8a]" />
                  Thanh toán an toàn hoặc tại quầy
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#168c8a]" />
                  Bảo mật thông tin khách hàng tuyệt đối
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#94a3b8] gap-4">
            <p>
              © {new Date().getFullYear()} Havenly Hotel & Resort. Mọi quyền
              được bảo lưu.
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => go("support")}
                className="hover:text-[#0f2b46] transition-colors"
              >
                Điều khoản dịch vụ
              </button>
              <button
                onClick={() => go("support")}
                className="hover:text-[#0f2b46] transition-colors"
              >
                Chính sách bảo mật
              </button>
              <button
                onClick={() => go("support")}
                className="hover:text-[#0f2b46] transition-colors"
              >
                Trợ giúp
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PORTAL SEARCH & ROOM LIST (CUSTOMER FLOW STEP 1)
   ───────────────────────────────────────────────────────────── */

export function Portal({ ctx, preset }: { ctx: CCtx; preset?: NavParams }) {
  const { store, go } = ctx

  const [inDate, setInDate] = useState(preset?.in ?? addDays(TODAY, 2))
  const [outDate, setOutDate] = useState(preset?.out ?? addDays(TODAY, 5))
  const [guests, setGuests] = useState(preset?.guests ?? 2)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc">("price-asc")
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [isSearched, setIsSearched] = useState(!!preset?.searched)

  const nights = nightsBetween(inDate, outDate)

  const handleSearch = () => {
    if (!inDate || !outDate) {
      setSearchError("Vui lòng chọn ngày nhận và ngày trả phòng.")
      return
    }
    if (inDate < TODAY) {
      setSearchError("Ngày nhận phòng không được ở quá khứ.")
      return
    }
    if (outDate <= inDate) {
      setSearchError("Ngày trả phòng phải sau ngày nhận phòng tối thiểu 1 đêm.")
      return
    }
    setSearchError("")
    setIsSearched(true)
    const el = document.getElementById("room-results")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Lọc danh sách loại phòng và đếm số phòng trống thực tế
  const filteredTypes = useMemo(() => {
    return store.types
      .filter((t) => selectedType === "all" || t.id === selectedType)
      .map((t) => {
        const available = isSearched
          ? availableRooms(store, inDate, outDate, t.id)
          : store.rooms.filter(
              (r) => r.type === t.id && r.status === "Available",
            )
        return {
          type: t,
          availableCount: available.length,
          sampleRoom: available[0] ?? store.rooms.find((r) => r.type === t.id),
        }
      })
      .filter((item) => {
        if (onlyAvailable && item.availableCount === 0) return false
        if (isSearched && item.type.capacity < guests) return false
        return true
      })
      .sort((a, b) =>
        sortBy === "price-asc"
          ? a.type.price - b.type.price
          : b.type.price - a.type.price,
      )
  }, [
    store,
    selectedType,
    sortBy,
    onlyAvailable,
    isSearched,
    inDate,
    outDate,
    guests,
  ])

  const handleSelectRoom = (typeId: string) => {
    go("room-detail", {
      typeId,
      in: inDate,
      out: outDate,
      guests,
      searched: isSearched,
    })
  }

  return (
    <PortalShell ctx={ctx} view="portal" wide>
      {/* Hero Presentation */}
      <section className="relative rounded-3xl overflow-hidden mb-10 shadow-lg border border-[#e4eaf0] bg-[#0f2b46] text-white">
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="Havenly Boutique Hotel lobby and architecture"
            className="w-full h-full object-cover opacity-45 mix-blend-luminosity scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2b46] via-[#0f2b46]/85 to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#d5a447] font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kỳ nghỉ dưỡng giữa lòng thành phố</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Không gian tĩnh lặng cho chuyến đi trọn vẹn
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6 font-normal">
            Trải nghiệm nội thất gỗ ấm áp, giường đệm cao cấp và dịch vụ buồng
            phòng tận tâm. Đặt phòng trực tuyến nhanh chóng với chính sách hủy
            linh hoạt.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#168c8a]" />
              Không cần thanh toán trước
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#168c8a]" />
              Hủy miễn phí trước 48 giờ
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#168c8a]" />
              Hỗ trợ 24/7 tại quầy
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Search & Filter Bar */}
      <section className="bg-white rounded-2xl p-6 shadow-md border border-[#e4eaf0] -mt-16 sm:-mt-20 relative z-20 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-in Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1b2c3c] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#168c8a]" />
              Ngày nhận phòng
            </label>
            <input
              type="date"
              min={TODAY}
              value={inDate}
              onChange={(e) => setInDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs font-medium focus:ring-2 focus:ring-[#168c8a] focus:border-[#168c8a] transition-colors"
            />
            {inDate && (
              <p className="text-[11px] text-[#64748b]">
                {weekday(inDate)}, {fmtDate(inDate)}
              </p>
            )}
          </div>

          {/* Check-out Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1b2c3c] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#168c8a]" />
              Ngày trả phòng
            </label>
            <input
              type="date"
              min={inDate || TODAY}
              value={outDate}
              onChange={(e) => setOutDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs font-medium focus:ring-2 focus:ring-[#168c8a] focus:border-[#168c8a] transition-colors"
            />
            {outDate && (
              <p className="text-[11px] text-[#64748b]">
                {weekday(outDate)}, {fmtDate(outDate)}{" "}
                {nights > 0 && `(${nights} đêm)`}
              </p>
            )}
          </div>

          {/* Guests Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1b2c3c] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#168c8a]" />
              Số lượng khách
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs font-medium focus:ring-2 focus:ring-[#168c8a] focus:border-[#168c8a] transition-colors bg-white"
            >
              <option value={1}>1 người lớn</option>
              <option value={2}>2 người lớn (Khuyên dùng)</option>
              <option value={3}>3 người lớn / Gia đình nhỏ</option>
              <option value={4}>4 người lớn / Nhóm bạn</option>
            </select>
            <p className="text-[11px] text-[#64748b]">
              Trẻ em dưới 6 tuổi lưu trú miễn phí
            </p>
          </div>

          {/* Search CTA */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSearch}
              className="w-full h-11 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <Search className="w-4 h-4 text-[#d5a447]" />
              <span>Tìm phòng trống</span>
            </button>
            <span className="text-[11px] text-[#94a3b8] text-center mt-1.5">
              Tự động kiểm tra thời gian thực
            </span>
          </div>
        </div>

        {searchError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{searchError}</span>
          </div>
        )}
      </section>

      {/* Results Header & Quick Category Filters */}
      <section id="room-results" className="scroll-mt-24 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e4eaf0] mb-8">
          <div>
            <span className="text-xs font-semibold text-[#168c8a] uppercase tracking-wider block mb-1">
              {isSearched
                ? `${nights} đêm lưu trú · ${fmtDate(inDate)} đến ${fmtDate(outDate)}`
                : "Danh mục phòng"}
            </span>
            <h2 className="text-2xl font-bold text-[#0f2b46]">
              {isSearched
                ? "Phòng trống phù hợp với bạn"
                : "Các loại phòng tại Havenly"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 bg-[#f1f5f9] p-1 rounded-xl text-xs">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedType === "all"
                    ? "bg-white text-[#0f2b46] shadow-xs font-semibold"
                    : "text-[#64748b] hover:text-[#0f2b46]"
                }`}
              >
                Tất cả
              </button>
              {store.types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedType === t.id
                      ? "bg-white text-[#0f2b46] shadow-xs font-semibold"
                      : "text-[#64748b] hover:text-[#0f2b46]"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Price Sorting */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "price-asc" | "price-desc")
                }
                className="h-9 px-3 rounded-lg border border-[#cbd5e1] text-xs font-medium bg-white text-[#334155]"
              >
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>

              <label className="hidden sm:flex items-center gap-1.5 text-xs text-[#475a6c] cursor-pointer pl-2">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-[#168c8a] focus:ring-[#168c8a]"
                />
                <span>Còn phòng</span>
              </label>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        {filteredTypes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-[#cbd5e1]">
            <BedDouble className="w-12 h-12 text-[#94a3b8] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#0f2b46] mb-1">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-xs text-[#64748b] max-w-md mx-auto mb-4">
              Không có loại phòng nào đáp ứng số lượng {guests} khách hoặc
              khoảng thời gian bạn đã chọn. Hãy thử chọn ngày khác hoặc giảm số
              khách.
            </p>
            <button
              onClick={() => {
                setSelectedType("all")
                setOnlyAvailable(false)
                setGuests(2)
              }}
              className="px-4 py-2 bg-[#0f2b46] text-white rounded-xl text-xs font-medium hover:bg-[#173c5d] transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTypes.map(({ type: t, availableCount }) => {
              const isSoldOut = availableCount === 0

              return (
                <article
                  key={t.id}
                  className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col ${
                    isSoldOut
                      ? "border-[#e2e8f0] opacity-80"
                      : "border-[#e4eaf0] hover:border-[#cbd5e1] hover:shadow-lg"
                  }`}
                >
                  {/* Room Thumbnail with Availability Badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-[#e2e8f0]">
                    <img
                      src={t.image}
                      alt={`Không gian phòng ${t.name} tại Havenly Hotel`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                      loading="lazy"
                    />

                    {/* Badge top-left */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-[#0f2b46]/90 text-white backdrop-blur-xs">
                        {t.view}
                      </span>
                    </div>

                    {/* Stock status badge top-right */}
                    <div className="absolute top-3 right-3">
                      {isSoldOut ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-600 text-white shadow-xs">
                          Hết phòng
                        </span>
                      ) : availableCount <= 2 ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500 text-white shadow-xs">
                          Chỉ còn {availableCount} phòng
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-xs">
                          Còn {availableCount} phòng trống
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-[#0f2b46] group-hover:text-[#168c8a] transition-colors">
                          Phòng {t.name}
                        </h3>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {t.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#b48328] bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#475a6c] leading-relaxed line-clamp-2 mb-4">
                      {t.desc}
                    </p>

                    {/* Room Attributes Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#f1f5f9] text-xs text-[#475a6c] mb-6">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#168c8a]" />
                        <span>Tối đa {t.capacity} khách</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#168c8a]" />
                        <span>{t.size} m²</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Bed className="w-3.5 h-3.5 text-[#168c8a]" />
                        <span className="truncate">{t.bed}</span>
                      </div>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="flex items-center gap-3 text-xs text-[#64748b] mb-6">
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-[#168c8a]" /> WiFi tốc
                        độ cao
                      </span>
                      <span className="flex items-center gap-1">
                        <AirVent className="w-3.5 h-3.5 text-[#168c8a]" /> Điều
                        hòa 2 chiều
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-[#168c8a]" /> Bồn tắm
                        riêng
                      </span>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-auto pt-4 border-t border-[#f1f5f9] flex items-end justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#0f2b46]">
                            {vnd(t.price)}
                          </span>
                          <span className="text-xs text-[#64748b]">/ đêm</span>
                        </div>
                        {isSearched && nights > 0 && (
                          <p className="text-xs text-[#168c8a] font-semibold mt-0.5">
                            Tổng {nights} đêm: {vnd(t.price * nights)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectRoom(t.id)}
                        disabled={isSoldOut}
                        className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-98 ${
                          isSoldOut
                            ? "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed"
                            : "bg-[#0f2b46] hover:bg-[#173c5d] text-white shadow-xs"
                        }`}
                      >
                        <span>
                          {isSoldOut ? "Đã hết phòng" : "Xem chi tiết & Đặt"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Curated Hotel Highlights */}
      <section className="bg-white rounded-2xl p-8 border border-[#e4eaf0] mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-semibold text-[#168c8a] tracking-wider uppercase block mb-1">
            Trải nghiệm chuẩn mực
          </span>
          <h2 className="text-2xl font-bold text-[#0f2b46]">
            Sự chỉn chu trong từng chi tiết nhỏ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#168c8a] flex items-center justify-center mx-auto md:mx-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0f2b46]">
              Buồng phòng chăm chút mỗi ngày
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Ga trải giường sợi bông tự nhiên 400 sợi, khăn tắm và vật dụng vệ
              sinh được khử khuẩn và thay mới mỗi ngày.
            </p>
          </div>

          <div className="space-y-2.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b48328] flex items-center justify-center mx-auto md:mx-0">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0f2b46]">
              Chính sách hủy phòng an tâm
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Hủy đặt phòng hoàn toàn miễn phí trước ngày nhận phòng 2 ngày.
              Linh hoạt thay đổi lịch trình khi kế hoạch đổi thay.
            </p>
          </div>

          <div className="space-y-2.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0f2b46] flex items-center justify-center mx-auto md:mx-0">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#0f2b46]">
              Ẩm thực & Thư giãn tại phòng
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Dịch vụ ẩm thực phục vụ tại phòng từ 06:30 đến 23:00 với thực đơn
              đa dạng và nguyên liệu địa phương tươi mới.
            </p>
          </div>
        </div>
      </section>
    </PortalShell>
  )
}

/* ─────────────────────────────────────────────────────────────
   ROOM DETAIL VIEW (CUSTOMER FLOW STEP 2)
   ───────────────────────────────────────────────────────────── */

export function RoomDetail({ ctx, params }: { ctx: CCtx; params: NavParams }) {
  const { store, go } = ctx

  const roomType =
    store.types.find((x) => x.id === params.typeId) ?? store.types[0]

  const [inDate, setInDate] = useState(params.in ?? addDays(TODAY, 2))
  const [outDate, setOutDate] = useState(params.out ?? addDays(TODAY, 5))
  const [guests, setGuests] = useState(params.guests ?? 2)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const nights = nightsBetween(inDate, outDate)

  const dateError = useMemo(() => {
    if (!inDate || !outDate) return "Vui lòng chọn ngày nhận và trả phòng."
    if (inDate < TODAY) return "Ngày nhận phòng không được ở quá khứ."
    if (outDate <= inDate) return "Ngày trả phòng phải sau ngày nhận phòng."
    if (guests > roomType.capacity)
      return `Loại phòng này chỉ chứa tối đa ${roomType.capacity} khách.`
    return ""
  }, [inDate, outDate, guests, roomType])

  // Danh sách phòng trống thực tế
  const availableRoomList = useMemo(() => {
    if (dateError) return []
    return availableRooms(store, inDate, outDate, roomType.id)
  }, [store, inDate, outDate, roomType, dateError])

  const reviews = SAMPLE_REVIEWS[roomType.id] ?? SAMPLE_REVIEWS.standard

  const handleProceedToCheckout = () => {
    if (availableRoomList.length === 0) return
    const chosenRoom = availableRoomList[0]
    go("checkout", {
      typeId: roomType.id,
      roomNo: chosenRoom.no,
      in: inDate,
      out: outDate,
      guests,
    })
  }

  return (
    <PortalShell ctx={ctx} view="room-detail">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() =>
            go("portal", {
              in: inDate,
              out: outDate,
              guests,
              searched: params.searched,
            })
          }
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46] px-3 py-1.5 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-[#e4eaf0]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách phòng</span>
        </button>

        <span className="text-xs text-[#64748b]">
          Mã loại phòng:{" "}
          <code className="font-mono text-[#0f2b46] font-semibold">
            {roomType.id.toUpperCase()}
          </code>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Photos, Details, Amenities, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery with Interactive Thumbnails */}
          <section className="bg-white rounded-2xl p-4 border border-[#e4eaf0] shadow-xs space-y-3">
            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100">
              <img
                src={roomType.gallery[activePhotoIndex] || roomType.image}
                alt={`Phòng ${roomType.name} - Ảnh ${activePhotoIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
                Ảnh {activePhotoIndex + 1} / {roomType.gallery.length}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {roomType.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative aspect-16/10 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activePhotoIndex
                      ? "border-[#168c8a] shadow-xs ring-2 ring-[#168c8a]/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Xem ảnh số ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Heading & Key Specs */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-[#168c8a] tracking-wider uppercase block mb-1">
                  {roomType.view}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2b46]">
                  Phòng {roomType.name}
                </h1>
                <p className="text-xs text-[#64748b] mt-1">
                  {roomType.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-[#b48328]">
                  4.9 / 5.0
                </span>
                <span className="text-[11px] text-[#94a3b8]">
                  ({reviews.length * 24} đánh giá)
                </span>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-[#f1f5f9] my-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <Users className="w-4 h-4 text-[#168c8a]" /> Sức chứa
                </div>
                <p className="text-xs font-semibold text-[#0f2b46]">
                  Tối đa {roomType.capacity} khách
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <Maximize2 className="w-4 h-4 text-[#168c8a]" /> Diện tích
                </div>
                <p className="text-xs font-semibold text-[#0f2b46]">
                  {roomType.size} m²
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <BedDouble className="w-4 h-4 text-[#168c8a]" /> Loại giường
                </div>
                <p className="text-xs font-semibold text-[#0f2b46]">
                  {roomType.bed}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <Eye className="w-4 h-4 text-[#168c8a]" /> Hướng nhìn
                </div>
                <p className="text-xs font-semibold text-[#0f2b46]">
                  {roomType.view}
                </p>
              </div>
            </div>

            {/* Narrative Description */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#0f2b46]">
                Mô tả không gian
              </h2>
              <p className="text-xs text-[#475a6c] leading-relaxed">
                {roomType.desc} Được thiết kế theo phong cách tối giản thanh
                lịch, phòng tận dụng ánh sáng tự nhiên với hệ thống kính cách âm
                2 lớp. Đệm lò xo túi độc lập êm ái kết hợp chăn lông vũ siêu nhẹ
                giúp bạn tái tạo năng lượng tuyệt đối sau ngày dài làm việc hoặc
                khám phá thành phố.
              </p>
            </div>
          </section>

          {/* Full Amenities Checklist */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#0f2b46]">
              Tiện nghi phòng cao cấp
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475a6c]">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc]">
                <Wifi className="w-4 h-4 text-[#168c8a]" />
                <span>Internet cáp quang không dây tốc độ cao miễn phí</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc]">
                <AirVent className="w-4 h-4 text-[#168c8a]" />
                <span>
                  Hệ thống điều hòa trung tâm kiểm soát nhiệt độ độc lập
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc]">
                <Bath className="w-4 h-4 text-[#168c8a]" />
                <span>
                  Phòng tắm riêng biệt có bồn tắm ngâm và vòi sen đứng
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc]">
                <Tv className="w-4 h-4 text-[#168c8a]" />
                <span>Smart TV 55 inch Ultra HD hỗ trợ Netflix và YouTube</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc]">
                <Coffee className="w-4 h-4 text-[#168c8a]" />
                <span>
                  Máy pha cà phê viên nén, ấm đun nước và trà hảo hạng
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc]">
                <ShieldCheck className="w-4 h-4 text-[#168c8a]" />
                <span>
                  Két sắt an toàn kích thước chứa vừa máy tính xách tay
                </span>
              </div>
            </div>
          </section>

          {/* Guest Reviews */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#0f2b46]">
                  Đánh giá từ khách lưu trú thực tế
                </h2>
                <p className="text-xs text-[#64748b]">
                  Tất cả nhận xét đều từ khách hàng đã hoàn thành kỳ nghỉ
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#0f2b46]">4.9</span>
                <span className="text-xs text-[#94a3b8]"> / 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((rev, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-[#fbfcfd] border border-[#f1f5f9] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={rev.author} size={28} />
                      <span className="text-xs font-semibold text-[#0f2b46]">
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        Đã xác minh
                      </span>
                    </div>
                    <span className="text-[11px] text-[#94a3b8]">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-[#1b2c3c]">
                    {rev.title}
                  </p>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky Booking Calculator Card */}
        <aside className="sticky top-24 bg-white rounded-2xl p-6 border border-[#e4eaf0] shadow-lg space-y-6">
          <div className="flex items-baseline justify-between border-b border-[#f1f5f9] pb-4">
            <div>
              <span className="text-2xl font-bold text-[#0f2b46]">
                {vnd(roomType.price)}
              </span>
              <span className="text-xs text-[#64748b]"> / đêm</span>
            </div>
            <span className="text-xs text-emerald-700 font-medium">
              Đã gồm thuế & phí
            </span>
          </div>

          {/* Date Picker Matrix */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#64748b]">
                  Nhận phòng
                </label>
                <input
                  type="date"
                  min={TODAY}
                  value={inDate}
                  onChange={(e) => setInDate(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-lg border border-[#cbd5e1] text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#64748b]">
                  Trả phòng
                </label>
                <input
                  type="date"
                  min={inDate || TODAY}
                  value={outDate}
                  onChange={(e) => setOutDate(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-lg border border-[#cbd5e1] text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#64748b]">
                Số khách lưu trú
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full h-10 px-2.5 rounded-lg border border-[#cbd5e1] text-xs font-medium bg-white"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} khách{" "}
                    {n > roomType.capacity
                      ? `(Vượt quá sức chứa ${roomType.capacity})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Status Box */}
          {dateError ? (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{dateError}</span>
            </div>
          ) : availableRoomList.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Đã kín phòng trong khoảng ngày này. Hãy thử chọn ngày khác.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                Còn {availableRoomList.length} phòng sẵn sàng đón khách.
              </span>
            </div>
          )}

          {/* Cost Breakdown */}
          {!dateError && nights > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#f1f5f9] text-xs">
              <div className="flex justify-between text-[#64748b]">
                <span>
                  {vnd(roomType.price)} × {nights} đêm
                </span>
                <span className="font-semibold text-[#1b2c3c]">
                  {vnd(roomType.price * nights)}
                </span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Thuế VAT & Phí dịch vụ (10%)</span>
                <span className="text-emerald-700 font-medium">Đã bao gồm</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0f2b46] pt-2 border-t border-[#f1f5f9]">
                <span>Tổng chi phí dự kiến</span>
                <span className="text-lg text-[#168c8a]">
                  {vnd(roomType.price * nights)}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] text-center">
                Không thu phí đặt cọc trước. Thanh toán tại quầy khi nhận phòng.
              </p>
            </div>
          )}

          {/* Booking CTA Button */}
          <button
            onClick={handleProceedToCheckout}
            disabled={!!dateError || availableRoomList.length === 0}
            className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 ${
              dateError || availableRoomList.length === 0
                ? "bg-[#cbd5e1] text-white cursor-not-allowed"
                : "bg-[#0f2b46] hover:bg-[#173c5d] text-white"
            }`}
          >
            <span>Tiến hành đặt phòng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </PortalShell>
  )
}

/* ─────────────────────────────────────────────────────────────
   MULTI-STEP CHECKOUT (CUSTOMER FLOW STEP 3)
   ───────────────────────────────────────────────────────────── */

export function Checkout({ ctx, params }: { ctx: CCtx; params: NavParams }) {
  const { store, me, go, notify } = ctx

  const room = store.rooms.find((r) => r.no === params.roomNo)
  const roomType = room
    ? store.types.find((x) => x.id === room.type)
    : undefined

  // Steps: 1 = Guest Info, 2 = Add-ons, 3 = Payment Method & Review
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Form states
  const [formData, setFormData] = useState({
    name: me.name,
    email: me.email,
    phone: me.phone,
    note: "",
  })
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["breakfast"])
  const [paymentMethod, setPaymentMethod] =
    useState<"reception" | "vietqr" | "card" | "momo">("reception")
  const [policyAgreed, setPolicyAgreed] = useState(false)
  const [validationAttempted, setValidationAttempted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!room || !roomType || !params.in || !params.out) {
    return (
      <PortalShell ctx={ctx} view="checkout">
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e4eaf0] p-8">
          <Calendar className="w-12 h-12 text-[#94a3b8] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#0f2b46] mb-1">
            Chưa chọn phòng đặt
          </h2>
          <p className="text-xs text-[#64748b] mb-4">
            Vui lòng quay lại tìm kiếm và chọn phòng trước khi thanh toán.
          </p>
          <button
            onClick={() => go("portal")}
            className="px-5 py-2.5 bg-[#0f2b46] text-white rounded-xl text-xs font-semibold hover:bg-[#173c5d]"
          >
            Tìm phòng ngay
          </button>
        </div>
      </PortalShell>
    )
  }

  const nights = nightsBetween(params.in, params.out)
  const roomCost = roomType.price * nights

  // Tính tiền dịch vụ gia tăng
  const addonsCost = selectedAddons.reduce((sum, addId) => {
    const opt = ADDON_OPTIONS.find((o) => o.id === addId)
    if (!opt) return sum
    return sum + (opt.isPerNight ? opt.price * nights : opt.price)
  }, 0)

  const totalCost = roomCost + addonsCost

  // Validation
  const errors = {
    name: !formData.name.trim() ? "Vui lòng nhập họ và tên khách lưu trú." : "",
    email: !/^\S+@\S+\.\S+$/.test(formData.email) ? "Email chưa hợp lệ." : "",
    phone:
      formData.phone.replace(/\D/g, "").length < 9
        ? "Số điện thoại chưa hợp lệ."
        : "",
  }

  const handleToggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      setValidationAttempted(true)
      if (errors.name || errors.email || errors.phone) return
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === 2) {
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleFinalSubmit = () => {
    if (!policyAgreed) {
      notify("Vui lòng đồng ý với chính sách đặt phòng để hoàn tất.")
      return
    }

    // Kiểm tra xung đột phòng lần cuối
    const stillFree = availableRooms(
      store,
      params.in!,
      params.out!,
      roomType.id,
    )
    if (!stillFree.some((r) => r.no === room.no)) {
      notify(
        "Rất tiếc! Phòng vừa được khách khác đặt. Vui lòng chọn phòng khác.",
      )
      go("room-detail", {
        typeId: roomType.id,
        in: params.in,
        out: params.out,
        guests: params.guests,
      })
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newBooking = store.addBooking({
        customerId: me.id,
        roomNo: room.no,
        in: params.in!,
        out: params.out!,
        status: "Đang chờ",
        guests: params.guests ?? 2,
        note: formData.note ? formData.note.trim() : undefined,
        addOns: selectedAddons,
        paymentMethod:
          paymentMethod === "reception"
            ? "Thanh toán tại quầy"
            : paymentMethod === "vietqr"
              ? "Chuyển khoản VietQR"
              : paymentMethod === "card"
                ? "Thẻ tín dụng"
                : "Ví điện tử MoMo",
      })

      setIsSubmitting(false)
      notify("Đặt phòng thành công!")
      go("success", { bookingId: newBooking.id })
    }, 700)
  }

  return (
    <PortalShell ctx={ctx} view="checkout">
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center max-w-xl mx-auto">
          {[
            { num: 1, label: "Thông tin khách" },
            { num: 2, label: "Dịch vụ thêm" },
            { num: 3, label: "Thanh toán & Chốt" },
          ].map((st, i) => (
            <React.Fragment key={st.num}>
              {i > 0 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep >= st.num ? "bg-[#168c8a]" : "bg-[#e2e8f0]"
                  }`}
                />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === st.num
                      ? "bg-[#0f2b46] text-white ring-4 ring-[#0f2b46]/10"
                      : currentStep > st.num
                        ? "bg-[#168c8a] text-white"
                        : "bg-[#e2e8f0] text-[#64748b]"
                  }`}
                >
                  {currentStep > st.num ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    st.num
                  )}
                </span>
                <span
                  className={`text-xs hidden sm:inline-block ${
                    currentStep === st.num
                      ? "font-bold text-[#0f2b46]"
                      : "text-[#64748b]"
                  }`}
                >
                  {st.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Wizard Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: GUEST INFO */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f2b46]">
                  Thông tin người đặt & Khách lưu trú
                </h2>
                <p className="text-xs text-[#64748b]">
                  Thông tin dùng để nhận phòng và nhận thông báo xác nhận
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-[#1b2c3c]">
                    Họ và tên khách
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                  />
                  {validationAttempted && errors.name && (
                    <p className="text-[11px] text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1b2c3c]">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="090 123 4567"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                  />
                  {validationAttempted && errors.phone && (
                    <p className="text-[11px] text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1b2c3c]">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                  />
                  {validationAttempted && errors.email && (
                    <p className="text-[11px] text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-[#1b2c3c]">
                    Yêu cầu đặc biệt (Tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    placeholder="Ví dụ: Giờ đến dự kiến khoảng 15:00, mong muốn phòng tầng cao, giường phụ hoặc không hút thuốc..."
                    className="w-full p-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() =>
                    go("room-detail", {
                      typeId: roomType.id,
                      in: params.in,
                      out: params.out,
                      guests: params.guests,
                    })
                  }
                  className="px-4 py-2.5 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <span>Tiếp tục: Dịch vụ thêm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADD-ONS SELECTION */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f2b46]">
                  Dịch vụ gia tăng nâng tầm kỳ nghỉ
                </h2>
                <p className="text-xs text-[#64748b]">
                  Tùy chọn bổ sung các dịch vụ độc quyền với giá ưu đãi
                </p>
              </div>

              <div className="space-y-3">
                {ADDON_OPTIONS.map((opt) => {
                  const selected = selectedAddons.includes(opt.id)
                  const priceText = opt.isPerNight
                    ? `${vnd(opt.price)} / đêm (Tổng: ${vnd(opt.price * nights)})`
                    : `${vnd(opt.price)} / kỳ nghỉ`

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selected
                          ? "border-[#168c8a] bg-teal-50/40 shadow-xs"
                          : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleToggleAddon(opt.id)}
                        className="mt-1 rounded text-[#168c8a] focus:ring-[#168c8a]"
                      />
                      <div className="p-2 rounded-lg bg-white border border-[#e2e8f0] text-[#168c8a] shrink-0">
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-[#0f2b46]">
                            {opt.name}
                          </h4>
                          <span className="text-xs font-bold text-[#168c8a]">
                            {priceText}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748b] mt-1">
                          {opt.desc}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Thông tin khách
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <span>Tiếp tục: Thanh toán</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD & CONFIRMATION */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f2b46]">
                  Phương thức thanh toán
                </h2>
                <p className="text-xs text-[#64748b]">
                  Lựa chọn hình thức thanh toán thuận tiện nhất cho bạn
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Pay at reception */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                    paymentMethod === "reception"
                      ? "border-[#168c8a] bg-teal-50/40 shadow-xs"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0f2b46]">
                      Thanh toán khi nhận phòng
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="reception"
                      checked={paymentMethod === "reception"}
                      onChange={() => setPaymentMethod("reception")}
                      className="text-[#168c8a] focus:ring-[#168c8a]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748b]">
                    Thanh toán trực tiếp bằng tiền mặt hoặc thẻ tại quầy lễ tân
                    lúc làm thủ tục Check-in.
                  </p>
                </label>

                {/* Option 2: VietQR */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                    paymentMethod === "vietqr"
                      ? "border-[#168c8a] bg-teal-50/40 shadow-xs"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0f2b46]">
                      Chuyển khoản VietQR
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vietqr"
                      checked={paymentMethod === "vietqr"}
                      onChange={() => setPaymentMethod("vietqr")}
                      className="text-[#168c8a] focus:ring-[#168c8a]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748b]">
                    Quét mã QR qua ứng dụng ngân hàng di động, xác nhận thanh
                    toán tức thời.
                  </p>
                </label>

                {/* Option 3: Credit/Debit Card */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#168c8a] bg-teal-50/40 shadow-xs"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0f2b46]">
                      Thẻ Quốc tế (Visa / Master)
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="text-[#168c8a] focus:ring-[#168c8a]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748b]">
                    Thanh toán an toàn qua cổng bảo mật tiêu chuẩn quốc tế
                    PCI-DSS.
                  </p>
                </label>

                {/* Option 4: MoMo */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                    paymentMethod === "momo"
                      ? "border-[#168c8a] bg-teal-50/40 shadow-xs"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0f2b46]">
                      Ví điện tử MoMo
                    </span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                      className="text-[#168c8a] focus:ring-[#168c8a]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748b]">
                    Mở ứng dụng MoMo để thanh toán chỉ với 1 chạm nhanh chóng.
                  </p>
                </label>
              </div>

              {/* Policy Checkbox */}
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policyAgreed}
                    onChange={(e) => setPolicyAgreed(e.target.checked)}
                    className="mt-1 rounded text-[#168c8a] focus:ring-[#168c8a]"
                  />
                  <span className="text-xs text-[#475a6c] leading-relaxed">
                    Tôi xác nhận thông tin lưu trú là chính xác và đồng ý với{" "}
                    <strong className="text-[#0f2b46]">
                      Chính sách đặt phòng & Hủy phòng
                    </strong>{" "}
                    của Havenly Hotel (Hủy miễn phí trước 48 giờ trước ngày nhận
                    phòng).
                  </span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Dịch vụ thêm
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || !policyAgreed}
                  className={`px-8 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-98 ${
                    isSubmitting || !policyAgreed
                      ? "bg-[#cbd5e1] text-white cursor-not-allowed"
                      : "bg-[#168c8a] hover:bg-[#0e7372] text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý đặt phòng...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Xác nhận đặt phòng</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="sticky top-24 bg-white rounded-2xl p-6 border border-[#e4eaf0] shadow-md space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#f1f5f9]">
            <img
              src={roomType.image}
              alt=""
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="overflow-hidden">
              <span className="text-[10px] font-semibold text-[#168c8a] uppercase tracking-wider block">
                Phòng được chọn
              </span>
              <h3 className="text-sm font-bold text-[#0f2b46] truncate">
                Phòng {roomType.name}
              </h3>
              <p className="text-xs text-[#64748b]">
                Phòng số {room.no} · Tầng {room.floor}
              </p>
            </div>
          </div>

          {/* Dates & Guests */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#64748b]">
              <span>Thời gian lưu trú:</span>
              <span className="font-semibold text-[#1b2c3c]">{nights} đêm</span>
            </div>
            <div className="flex items-center justify-between text-[#64748b]">
              <span>Ngày nhận phòng:</span>
              <span className="font-semibold text-[#1b2c3c]">
                {fmtDate(params.in)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748b]">
              <span>Ngày trả phòng:</span>
              <span className="font-semibold text-[#1b2c3c]">
                {fmtDate(params.out)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#64748b]">
              <span>Số khách:</span>
              <span className="font-semibold text-[#1b2c3c]">
                {params.guests ?? 2} khách
              </span>
            </div>
          </div>

          {/* Line Items Breakdown */}
          <div className="space-y-2 pt-3 border-t border-[#f1f5f9] text-xs">
            <div className="flex justify-between text-[#64748b]">
              <span>Tiền phòng ({nights} đêm)</span>
              <span className="font-semibold text-[#1b2c3c]">
                {vnd(roomCost)}
              </span>
            </div>

            {selectedAddons.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-[#168c8a] block">
                  Dịch vụ bổ sung:
                </span>
                {selectedAddons.map((addId) => {
                  const opt = ADDON_OPTIONS.find((o) => o.id === addId)
                  if (!opt) return null
                  const cost = opt.isPerNight ? opt.price * nights : opt.price
                  return (
                    <div
                      key={addId}
                      className="flex justify-between text-[11px] text-[#64748b] pl-2"
                    >
                      <span className="truncate max-w-[150px]">{opt.name}</span>
                      <span>{vnd(cost)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-[#0f2b46] pt-3 border-t border-[#f1f5f9]">
              <span>Tổng thanh toán</span>
              <span className="text-xl text-[#168c8a]">{vnd(totalCost)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] text-[11px] text-[#64748b] space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-[#0f2b46]">
              <ShieldCheck className="w-4 h-4 text-[#168c8a]" /> Cam kết minh
              bạch
            </p>
            <p>Không phát sinh phụ phí ẩn khi nhận phòng.</p>
          </div>
        </aside>
      </div>
    </PortalShell>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUCCESS CONFIRMATION & E-TICKET (CUSTOMER FLOW STEP 4)
   ───────────────────────────────────────────────────────────── */

export function Success({ ctx, bookingId }: { ctx: CCtx; bookingId?: string }) {
  const { store, go } = ctx

  const booking = store.bookings.find((b) => b.id === bookingId)

  if (!booking) {
    return (
      <PortalShell ctx={ctx} view="success">
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e4eaf0] p-8 max-w-lg mx-auto">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#0f2b46] mb-1">
            Không tìm thấy mã đơn đặt phòng
          </h2>
          <p className="text-xs text-[#64748b] mb-4">
            Hãy kiểm tra lại trong danh sách các kỳ nghỉ của bạn.
          </p>
          <button
            onClick={() => go("my-bookings")}
            className="px-5 py-2.5 bg-[#0f2b46] text-white rounded-xl text-xs font-semibold"
          >
            Đến danh sách booking
          </button>
        </div>
      </PortalShell>
    )
  }

  const roomType = typeOf(store, booking.roomNo)
  const nights = nightsBetween(booking.in, booking.out)
  const totalPrice = totalOf(store, booking)

  const handlePrint = () => {
    window.print()
  }

  return (
    <PortalShell ctx={ctx} view="success">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2b46]">
            Đặt phòng thành công!
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto">
            Cảm ơn bạn đã lựa chọn Havenly Hotel & Resort. Chúng tôi đã gửi
            email xác nhận chi tiết về kỳ nghỉ của bạn.
          </p>
        </div>

        {/* E-Ticket Card Styled as a Luxury Boarding Voucher */}
        <div className="bg-white rounded-3xl border border-[#e4eaf0] shadow-xl overflow-hidden relative">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0f2b46] to-[#173c5d] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[11px] tracking-wider text-[#d5a447] font-semibold uppercase block">
                Phiếu xác nhận đặt phòng điện tử
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                Phòng {roomType.name}
              </h2>
              <p className="text-xs text-slate-300">
                Phòng {booking.roomNo} · {roomType.view}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
              <span className="text-[10px] text-slate-300 uppercase block">
                Mã Booking
              </span>
              <span className="font-mono text-base font-bold text-white tracking-wider">
                {booking.id}
              </span>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#f1f5f9] text-xs">
              <div>
                <span className="text-[11px] text-[#94a3b8] uppercase block mb-1">
                  Nhận phòng
                </span>
                <p className="font-bold text-[#0f2b46]">
                  {fmtDate(booking.in)}
                </p>
                <p className="text-[11px] text-[#64748b]">từ 14:00</p>
              </div>

              <div>
                <span className="text-[11px] text-[#94a3b8] uppercase block mb-1">
                  Trả phòng
                </span>
                <p className="font-bold text-[#0f2b46]">
                  {fmtDate(booking.out)}
                </p>
                <p className="text-[11px] text-[#64748b]">trước 12:00</p>
              </div>

              <div>
                <span className="text-[11px] text-[#94a3b8] uppercase block mb-1">
                  Thời gian
                </span>
                <p className="font-bold text-[#0f2b46]">{nights} đêm</p>
                <p className="text-[11px] text-[#64748b]">
                  {booking.guests} khách
                </p>
              </div>

              <div>
                <span className="text-[11px] text-[#94a3b8] uppercase block mb-1">
                  Tổng thanh toán
                </span>
                <p className="font-bold text-base text-[#168c8a]">
                  {vnd(totalPrice)}
                </p>
                <p className="text-[11px] text-emerald-700">Tại quầy lễ tân</p>
              </div>
            </div>

            {/* QR Code Verification for Fast Check-in */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
              <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-xs border border-[#cbd5e1] shrink-0 flex items-center justify-center">
                {/* SVG Mock QR Code */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-[#0f2b46]"
                  fill="currentColor"
                >
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M40,40 h20 v20 h-20 z M70,70 h10 v10 h-10 z M80,80 h20 v20 h-20 z M10,40 h10 v10 h-10 z M70,40 h20 v10 h-20 z" />
                </svg>
              </div>

              <div className="space-y-1 text-center sm:text-left text-xs">
                <h4 className="font-bold text-[#0f2b46] flex items-center justify-center sm:justify-start gap-1.5">
                  <QrCode className="w-4 h-4 text-[#168c8a]" />
                  Check-in siêu tốc không cần giấy tờ
                </h4>
                <p className="text-[#64748b] leading-relaxed">
                  Xuất trình mã QR này hoặc đọc mã{" "}
                  <strong className="text-[#0f2b46]">{booking.id}</strong> tại
                  quầy lễ tân khi đến để nhận chìa khóa phòng ngay lập tức.
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 sm:p-6 bg-[#f8fafc] border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46] px-4 py-2 rounded-xl border border-[#cbd5e1] bg-white hover:bg-[#f1f5f9] transition-colors"
            >
              <Printer className="w-4 h-4 text-[#168c8a]" />
              <span>In phiếu xác nhận</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => go("portal")}
                className="px-4 py-2 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46]"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => go("my-bookings", { bookingId: booking.id })}
                className="px-5 py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>Xem trong Booking của tôi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}

/* ─────────────────────────────────────────────────────────────
   MY BOOKINGS MANAGEMENT (CUSTOMER FLOW STEP 5)
   ───────────────────────────────────────────────────────────── */

export function MyBookings({ ctx, focusId }: { ctx: CCtx; focusId?: string }) {
  const { store, me, go, notify } = ctx

  const [activeTab, setActiveTab] =
    useState<"upcoming" | "completed" | "cancelled">("upcoming")
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(
    null,
  )
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(focusId ?? null)

  // Review modal state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState("")

  const myBookings = useMemo(() => {
    return store.bookings.filter((b) => b.customerId === me.id)
  }, [store.bookings, me.id])

  const grouped = useMemo(() => {
    return {
      upcoming: myBookings
        .filter(
          (b) =>
            (b.status === "Đang chờ" || b.status === "Đã xác nhận") &&
            b.out >= TODAY,
        )
        .sort((a, b) => a.in.localeCompare(b.in)),
      completed: myBookings
        .filter(
          (b) =>
            b.status === "Đã hoàn thành" ||
            (b.status === "Đã xác nhận" && b.out < TODAY),
        )
        .sort((a, b) => b.in.localeCompare(a.in)),
      cancelled: myBookings
        .filter((b) => b.status === "Đã hủy")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }
  }, [myBookings])

  useEffect(() => {
    if (focusId) {
      if (grouped.upcoming.some((b) => b.id === focusId))
        setActiveTab("upcoming")
      else if (grouped.completed.some((b) => b.id === focusId))
        setActiveTab("completed")
      else if (grouped.cancelled.some((b) => b.id === focusId))
        setActiveTab("cancelled")
    }
  }, [focusId, grouped])

  const currentList = grouped[activeTab]

  const handleSaveReview = () => {
    if (!reviewBooking) return
    store.updateBooking(reviewBooking.id, {
      rating: reviewRating,
      reviewComment: reviewText,
    })
    notify("Cảm ơn bạn đã gửi đánh giá quý báu cho khách sạn!")
    setReviewBooking(null)
    setReviewText("")
  }

  return (
    <PortalShell ctx={ctx} view="my-bookings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e4eaf0]">
        <div>
          <span className="text-xs font-semibold text-[#168c8a] tracking-wider uppercase block mb-1">
            Quản lý kỳ nghỉ cá nhân
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2b46]">
            Booking của tôi
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Theo dõi, chỉnh sửa ngày nhận phòng hoặc xem lại lịch sử lưu trú của
            bạn
          </p>
        </div>

        <button
          onClick={() => go("portal")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-98 self-start sm:self-auto"
        >
          <Search className="w-4 h-4 text-[#d5a447]" />
          <span>Đặt phòng mới</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4eaf0] mb-8">
        {[
          { key: "upcoming", label: "Sắp tới", count: grouped.upcoming.length },
          {
            key: "completed",
            label: "Đã hoàn thành",
            count: grouped.completed.length,
          },
          {
            key: "cancelled",
            label: "Đã hủy",
            count: grouped.cancelled.length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`pb-3 px-4 text-xs font-semibold transition-all relative flex items-center gap-2 ${
              activeTab === tab.key
                ? "text-[#0f2b46] border-b-2 border-[#168c8a]"
                : "text-[#64748b] hover:text-[#0f2b46]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key
                  ? "bg-teal-50 text-[#168c8a] font-bold"
                  : "bg-slate-100 text-[#64748b]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Booking List */}
      {currentList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#cbd5e1] p-8">
          <Calendar className="w-12 h-12 text-[#94a3b8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0f2b46] mb-1">
            {activeTab === "upcoming"
              ? "Chưa có kỳ nghỉ sắp tới"
              : activeTab === "completed"
                ? "Chưa có lịch sử lưu trú"
                : "Không có đơn đặt phòng nào bị hủy"}
          </h3>
          <p className="text-xs text-[#64748b] max-w-sm mx-auto mb-6">
            {activeTab === "upcoming"
              ? "Hãy tìm ngay một căn phòng ưng ý cho kỳ nghỉ cuối tuần sắp tới."
              : "Mọi thông tin lưu trú sẽ được lưu lại để bạn tiện theo dõi."}
          </p>
          {activeTab === "upcoming" && (
            <button
              onClick={() => go("portal")}
              className="px-5 py-2.5 bg-[#0f2b46] text-white rounded-xl text-xs font-semibold hover:bg-[#173c5d]"
            >
              Khám phá phòng ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((bk) => {
            const roomType = typeOf(store, bk.roomNo)
            const nights = nightsBetween(bk.in, bk.out)
            const isPending = bk.status === "Đang chờ"
            const isExpanded = expandedId === bk.id
            const totalPrice = totalOf(store, bk)

            return (
              <article
                key={bk.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? "border-[#168c8a] shadow-md ring-1 ring-[#168c8a]/20"
                    : "border-[#e4eaf0] hover:shadow-xs"
                }`}
              >
                <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center">
                  {/* Room Thumbnail */}
                  <img
                    src={roomType.image}
                    alt=""
                    className="w-full md:w-36 h-28 rounded-xl object-cover shrink-0"
                  />

                  {/* Main Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          bk.status === "Đã xác nhận"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : bk.status === "Đang chờ"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : bk.status === "Đã hoàn thành"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {bk.status}
                      </span>
                      <span className="font-mono text-xs text-[#94a3b8]">
                        Mã: {bk.id}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f2b46]">
                      Phòng {roomType.name} (P.{bk.roomNo})
                    </h3>

                    {/* Dates summary */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#475a6c]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#168c8a]" />
                        {fmtDate(bk.in)} – {fmtDate(bk.out)} ({nights} đêm)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#168c8a]" />
                        {bk.guests} khách
                      </span>
                      <span className="font-bold text-[#168c8a]">
                        {vnd(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-col items-center gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#f1f5f9]">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : bk.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] text-xs font-semibold text-[#475a6c] hover:bg-[#f8fafc] flex items-center gap-1"
                    >
                      <span>{isExpanded ? "Thu gọn" : "Chi tiết"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {activeTab === "upcoming" && (
                      <>
                        <button
                          onClick={() => setEditingBooking(bk)}
                          disabled={!isPending}
                          title={
                            isPending
                              ? "Thay đổi ngày lưu trú"
                              : "Đơn đã xác nhận, vui lòng gọi lễ tân để đổi ngày"
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                            isPending
                              ? "bg-slate-100 text-[#0f2b46] hover:bg-slate-200"
                              : "bg-slate-50 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Đổi ngày</span>
                        </button>

                        <button
                          onClick={() => setCancellingBooking(bk)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Hủy phòng
                        </button>
                      </>
                    )}

                    {activeTab === "completed" && (
                      <button
                        onClick={() => {
                          setReviewBooking(bk)
                          setReviewRating(bk.rating || 5)
                          setReviewText(bk.reviewComment || "")
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {bk.rating ? "Sửa đánh giá" : "Đánh giá kỳ nghỉ"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Breakdown Drawer */}
                {isExpanded && (
                  <div className="bg-[#fbfcfd] p-5 border-t border-[#f1f5f9] text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[#94a3b8] block">
                          Thời gian nhận phòng
                        </span>
                        <p className="font-semibold text-[#0f2b46]">
                          {fmtDate(bk.in)} (Từ 14:00)
                        </p>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block">
                          Thời gian trả phòng
                        </span>
                        <p className="font-semibold text-[#0f2b46]">
                          {fmtDate(bk.out)} (Trước 12:00)
                        </p>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block">
                          Phương thức thanh toán
                        </span>
                        <p className="font-semibold text-[#0f2b46]">
                          {bk.paymentMethod || "Thanh toán trực tiếp tại quầy"}
                        </p>
                      </div>
                    </div>

                    {bk.note && (
                      <div className="p-3 bg-white rounded-xl border border-[#e2e8f0]">
                        <span className="font-semibold text-[#0f2b46] block mb-0.5">
                          Ghi chú của bạn:
                        </span>
                        <p className="text-[#64748b]">{bk.note}</p>
                      </div>
                    )}

                    {bk.reviewComment && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-1 text-amber-600 mb-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold text-xs">
                            {bk.rating} / 5 sao
                          </span>
                        </div>
                        <p className="text-[#475a6c]">{bk.reviewComment}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      {/* Edit Booking Dates Modal */}
      {editingBooking && (
        <ChangeDatesModal
          store={store}
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={(newIn, newOut) => {
            store.updateBooking(editingBooking.id, { in: newIn, out: newOut })
            setEditingBooking(null)
            notify("Đã cập nhật ngày lưu trú mới thành công!")
          }}
        />
      )}

      {/* Cancel Booking Confirmation Dialog */}
      {cancellingBooking && (
        <ConfirmDialog
          danger
          title="Xác nhận hủy đặt phòng?"
          confirmLabel="Xác nhận hủy"
          text={
            <>
              Bạn sắp hủy booking{" "}
              <strong className="text-[#0f2b46]">{cancellingBooking.id}</strong>{" "}
              từ ngày {fmtDate(cancellingBooking.in)} đến{" "}
              {fmtDate(cancellingBooking.out)}. Bạn có chắc chắn muốn hủy không?
            </>
          }
          onClose={() => setCancellingBooking(null)}
          onConfirm={() => {
            store.updateBooking(cancellingBooking.id, { status: "Đã hủy" })
            setCancellingBooking(null)
            notify(`Đã hủy booking ${cancellingBooking.id}`)
          }}
        />
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#e4eaf0] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0f2b46]">
                Đánh giá kỳ nghỉ của bạn
              </h3>
              <button
                onClick={() => setReviewBooking(null)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-[#0f2b46]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748b]">
              Chia sẻ trải nghiệm của bạn tại phòng{" "}
              {typeOf(store, reviewBooking.roomNo).name} (P.
              {reviewBooking.roomNo})
            </p>

            {/* Star Rating Selector */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 transition-transform hover:scale-115 focus:outline-hidden"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= reviewRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 hover:text-amber-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Comment Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1b2c3c]">
                Cảm nhận của bạn
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Phòng ốc sạch sẽ, nhân viên chu đáo, bữa sáng ngon miệng..."
                className="w-full p-3 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-[#475a6c] hover:text-[#0f2b46]"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-5 py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  )
}

/* ─────────────────────────────────────────────────────────────
   PROFILE & ACCOUNT SETTINGS (CUSTOMER FLOW STEP 6)
   ───────────────────────────────────────────────────────────── */

export function Profile({ ctx }: { ctx: CCtx }) {
  const { store, me, notify } = ctx

  const [form, setForm] = useState({
    name: me.name,
    email: me.email,
    phone: me.phone,
  })
  const [triedSave, setTriedSave] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  })
  const [passwordError, setPasswordError] = useState("")

  const myBookings = store.bookings.filter((b) => b.customerId === me.id)
  const completedStays = myBookings.filter((b) => b.status === "Đã hoàn thành")
  const totalNights = completedStays.reduce(
    (sum, b) => sum + nightsBetween(b.in, b.out),
    0,
  )

  const handleUpdateProfile = () => {
    setTriedSave(true)
    if (
      !form.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(form.email) ||
      form.phone.length < 9
    ) {
      return
    }
    store.updateCustomer(me.id, form)
    notify("Đã cập nhật hồ sơ cá nhân thành công!")
  }

  const handleChangePassword = () => {
    if (!passwordForm.current || passwordForm.next.length < 8) {
      setPasswordError("Mật khẩu mới phải có tối thiểu 8 ký tự.")
      return
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("Mật khẩu xác nhận không khớp.")
      return
    }
    setPasswordError("")
    setPasswordForm({ current: "", next: "", confirm: "" })
    notify("Đổi mật khẩu thành công!")
  }

  return (
    <PortalShell ctx={ctx} view="profile">
      <div className="mb-8 pb-6 border-b border-[#e4eaf0]">
        <span className="text-xs font-semibold text-[#168c8a] tracking-wider uppercase block mb-1">
          Tài khoản khách hàng
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2b46]">
          Hồ sơ cá nhân
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Quản lý thông tin liên hệ và cài đặt bảo mật tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Member Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#e4eaf0] shadow-xs text-center space-y-4">
          <Avatar name={me.name} size={72} />
          <div>
            <h3 className="text-lg font-bold text-[#0f2b46]">{me.name}</h3>
            <p className="text-xs text-[#64748b]">{me.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Thành viên Thân thiết (Gold)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f1f5f9] text-xs">
            <div className="p-3 bg-[#f8fafc] rounded-xl">
              <span className="text-xl font-bold text-[#0f2b46] block">
                {myBookings.length}
              </span>
              <span className="text-[#64748b] text-[11px]">Lượt đặt phòng</span>
            </div>
            <div className="p-3 bg-[#f8fafc] rounded-xl">
              <span className="text-xl font-bold text-[#168c8a] block">
                {totalNights}
              </span>
              <span className="text-[#64748b] text-[11px]">Đêm nghỉ dưỡng</span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#168c8a]" />
              Thông tin liên hệ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#1b2c3c]">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1b2c3c]">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1b2c3c]">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="px-5 py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#168c8a]" />
              Đổi mật khẩu tài khoản
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#1b2c3c]">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current: e.target.value,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1b2c3c]">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.next}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, next: e.target.value })
                  }
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1b2c3c]">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm: e.target.value,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-xs text-red-600">{passwordError}</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleChangePassword}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0f2b46] text-xs font-semibold rounded-xl"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}

/* ─────────────────────────────────────────────────────────────
   SUPPORT & CONCIERGE HELP DESK (CUSTOMER FLOW STEP 7)
   ───────────────────────────────────────────────────────────── */

const FAQ_LIST: { q: string; a: string }[] = [
  {
    q: "Tôi có thể hủy phòng hoặc đổi ngày lưu trú không?",
    a: "Bạn có thể tự do đổi ngày lưu trú trực tuyến khi booking đang ở trạng thái “Đang chờ”. Nếu booking đã được xác nhận, vui lòng liên hệ trực tiếp hotline lễ tân 028 3822 1188. Chính sách hủy hoàn toàn miễn phí trước ngày nhận phòng 48 giờ.",
  },
  {
    q: "Thời gian nhận phòng và trả phòng quy định như thế nào?",
    a: "Giờ nhận phòng tiêu chuẩn là từ 14:00 và giờ trả phòng là trước 12:00 trưa. Bạn có thể chọn dịch vụ “Nhận phòng sớm từ 10:00” khi đặt phòng hoặc thông báo trước cho lễ tân để được hỗ trợ.",
  },
  {
    q: "Hình thức thanh toán tại Havenly như thế nào?",
    a: "Khách sạn hỗ trợ thanh toán linh hoạt: bạn có thể chọn thanh toán trực tiếp tại quầy lễ tân khi nhận phòng (bằng tiền mặt hoặc quẹt thẻ), hoặc thanh toán qua chuyển khoản VietQR, thẻ quốc tế và ví MoMo.",
  },
  {
    q: "Khách sạn có bãi đỗ xe ô tô không?",
    a: "Havenly có tầng hầm đỗ xe 24/7 hoàn toàn miễn phí dành riêng cho khách lưu trú, có nhân viên an ninh hướng dẫn đỗ xe khi bạn đến nơi.",
  },
]

export function Support({ ctx }: { ctx: CCtx }) {
  const { notify, me } = ctx

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [ticketForm, setTicketForm] = useState({ subject: "", body: "" })
  const [ticketSent, setTicketSent] = useState(false)

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketForm.subject.trim() || !ticketForm.body.trim()) {
      notify("Vui lòng nhập đầy đủ tiêu đề và nội dung cần hỗ trợ.")
      return
    }
    setTicketSent(true)
    notify(
      `Cảm ơn ${me.name}, yêu cầu của bạn đã được chuyển tới bộ phận Chăm sóc khách hàng!`,
    )
    setTicketForm({ subject: "", body: "" })
  }

  return (
    <PortalShell ctx={ctx} view="support">
      <div className="mb-8 pb-6 border-b border-[#e4eaf0]">
        <span className="text-xs font-semibold text-[#168c8a] tracking-wider uppercase block mb-1">
          Hỗ trợ & Trợ giúp
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2b46]">
          Trung tâm hỗ trợ khách hàng
        </h1>
        <p className="text-xs text-[#64748b] mt-1">
          Đội ngũ Lễ tân & Concierge luôn sẵn sàng đồng hành cùng bạn 24/7
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Direct Contacts & FAQ */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3 Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e4eaf0] shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#168c8a] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#0f2b46]">
                Hotline Lễ tân 24/7
              </h3>
              <p className="text-xs text-[#168c8a] font-semibold">
                028 3822 1188
              </p>
              <p className="text-[11px] text-[#94a3b8]">
                Hỗ trợ trực tiếp ngay lập tức
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e4eaf0] shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#b48328] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#0f2b46]">
                Email Concierge
              </h3>
              <p className="text-xs text-[#0f2b46] font-semibold">
                xinchao@havenly.vn
              </p>
              <p className="text-[11px] text-[#94a3b8]">Phản hồi trong 2 giờ</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e4eaf0] shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0f2b46] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#0f2b46]">
                Địa chỉ khách sạn
              </h3>
              <p className="text-xs text-[#0f2b46] font-semibold truncate">
                27 Nguyễn Huệ, Q.1
              </p>
              <p className="text-[11px] text-[#94a3b8]">
                Trung tâm TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0f2b46] mb-2">
              Câu hỏi thường gặp
            </h3>

            <div className="space-y-3">
              {FAQ_LIST.map((faq, idx) => {
                const isOpen = openFaqIndex === idx
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#e2e8f0] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs text-[#0f2b46] hover:bg-[#f8fafc] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#64748b] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#64748b] leading-relaxed border-t border-[#f1f5f9] bg-[#fbfcfd]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Send Message Form */}
        <aside className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e4eaf0] shadow-md space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#0f2b46]">
              Gửi tin nhắn yêu cầu
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Chúng tôi sẽ liên hệ phản hồi qua email của bạn
            </p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1b2c3c]">
                Chủ đề yêu cầu
              </label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, subject: e.target.value })
                }
                placeholder="Ví dụ: Đổi giờ nhận phòng, hỗ trợ xe đưa đón..."
                className="w-full h-10 px-3 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1b2c3c]">
                Nội dung tin nhắn
              </label>
              <textarea
                rows={5}
                value={ticketForm.body}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, body: e.target.value })
                }
                placeholder="Mô tả chi tiết câu hỏi hoặc yêu cầu của bạn..."
                className="w-full p-3 rounded-xl border border-[#cbd5e1] text-xs focus:ring-2 focus:ring-[#168c8a]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f2b46] hover:bg-[#173c5d] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
            >
              <MessageSquare className="w-4 h-4 text-[#d5a447]" />
              <span>Gửi tin nhắn hỗ trợ</span>
            </button>
          </form>

          {ticketSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tin nhắn đã được gửi tới Lễ tân thành công.</span>
            </div>
          )}
        </aside>
      </div>
    </PortalShell>
  )
}


export function BookingDetail({ ctx, bookingId }: { ctx: CCtx; bookingId?: string }) {
  return <MyBookings ctx={ctx} focusId={bookingId} />
}
