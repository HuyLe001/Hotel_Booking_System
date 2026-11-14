import { useState } from 'react'
import { Avatar, Badge, Button, Card, ConfirmDialog, EmptyState, ErrorState, Field, InlineError, Modal, SelectField, Skeleton, SkeletonCards, Tabs, TextArea, Toggle } from './ui'
import { Ctx } from './admin'

const COLORS: [string, string, string][] = [['Navy', '#0F2B46', 'Tiêu đề, sidebar'], ['Teal', '#168C8A', 'Hành động chính'], ['Gold', '#D5A447', 'Điểm nhấn, chờ xử lý'], ['Nền', '#F6F8FB', 'Nền trang'], ['Danger', '#C94848', 'Hủy, lỗi']]

export function UiKitPage({ ctx }: { ctx: Ctx }) {
  const [modal, setModal] = useState(false)
  const [confirm, setConfirm] = useState<'normal' | 'danger' | null>(null)
  const [tab, setTab] = useState<'a' | 'b'>('a')
  const [on, setOn] = useState(true)
  const [retrying, setRetrying] = useState(false)
  const [saving, setSaving] = useState(false)
  const retry = () => { setRetrying(true); window.setTimeout(() => { setRetrying(false); ctx.notify('Đã tải lại dữ liệu thành công') }, 900) }
  const save = () => { setSaving(true); window.setTimeout(() => { setSaving(false); ctx.notify('Đã lưu thay đổi') }, 900) }
  return <div className="kit">
    <div className="page-heading"><div><div><h2>Thư viện giao diện</h2><p>Component dùng chung và các trạng thái giao diện của Havenly.</p></div></div></div>
    <section className="kit-section"><h3>Component · Màu sắc</h3><div className="swatches">{COLORS.map(([n, c, d]) => <div key={n}><i style={{ background: c }} /><b>{n}</b><small>{c} · {d}</small></div>)}</div></section>
    <section className="kit-section"><h3>Component · Nút & điều khiển</h3><div className="kit-grid">
      <Card><small>NÚT</small><div className="kit-row"><Button>Chính</Button><Button variant="secondary">Phụ</Button><Button variant="danger">Hủy</Button><Button variant="ghost">Ghost</Button><Button variant="icon" icon="edit" title="Sửa" /></div>
        <div className="kit-row"><Button loading={saving} onClick={save}>{saving ? 'Đang lưu…' : 'Lưu (bấm thử)'}</Button><Button disabled>Vô hiệu</Button></div></Card>
      <Card><small>BADGE TRẠNG THÁI</small><div className="kit-row">{['Đang chờ', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy', 'Available', 'Maintenance'].map(s => <Badge key={s} status={s} />)}</div></Card>
      <Card><small>FORM</small><Field label="Họ và tên" placeholder="Nguyễn Minh Anh" /><Field label="Email" icon="mail" defaultValue="email-sai" error="Email chưa hợp lệ." /><SelectField label="Loại phòng"><option>Deluxe</option></SelectField><TextArea label="Ghi chú" rows={2} placeholder="Yêu cầu đặc biệt…" /></Card>
      <Card><small>TAB · TOGGLE · AVATAR</small><Tabs value={tab} onChange={setTab} items={[{ id: 'a', label: 'Sắp tới', count: 2 }, { id: 'b', label: 'Đã hủy', count: 1 }]} /><div className="kit-row"><Toggle on={on} onChange={setOn} label="Thông báo" /><Avatar name="Nguyễn Minh Anh" /></div></Card>
      <Card><small>MODAL & XÁC NHẬN</small><div className="kit-row"><Button variant="secondary" onClick={() => setModal(true)}>Mở modal</Button><Button variant="secondary" onClick={() => setConfirm('normal')}>Xác nhận booking</Button><Button variant="danger" onClick={() => setConfirm('danger')}>Hủy booking</Button></div><div className="kit-row"><Button variant="secondary" onClick={() => ctx.notify('Đặt phòng thành công')}>Hiện toast</Button></div></Card>
    </div></section>
    <section className="kit-section"><h3>Trạng thái · Đang tải</h3><p>Skeleton thay thế nội dung trong lúc chờ dữ liệu.</p><div className="kit-grid"><Card><small>DÒNG DỮ LIỆU</small><div className="kit-row"><Skeleton w={34} h={34} r={17} /><Skeleton w="50%" /><Skeleton w={80} h={24} r={12} /></div><Skeleton /><Skeleton w="70%" /></Card></div><div style={{ marginTop: 16 }}><SkeletonCards count={2} /></div></section>
    <section className="kit-section"><h3>Trạng thái · Trống & lỗi</h3><div className="kit-grid">
      <Card><EmptyState icon="calendar" title="Chưa có booking" text="Các booking mới sẽ xuất hiện tại đây." action={<Button variant="secondary">Tạo booking</Button>} /></Card>
      <Card><ErrorState onRetry={retry} retrying={retrying} /></Card>
      <Card><small>LỖI KHI LƯU</small><InlineError text="Không thể lưu thay đổi. Vui lòng kiểm tra kết nối." onRetry={retry} /></Card>
    </div></section>
    {modal && <Modal title="Ví dụ modal" eyebrow="COMPONENT" onClose={() => setModal(false)} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Đóng</Button><Button onClick={() => { setModal(false); ctx.notify('Đã lưu') }}>Lưu</Button></>}><Field label="Tên" placeholder="Nhập tên" /></Modal>}
    {confirm && <ConfirmDialog danger={confirm === 'danger'} title={confirm === 'danger' ? 'Hủy booking này?' : 'Xác nhận booking?'} confirmLabel={confirm === 'danger' ? 'Hủy booking' : 'Xác nhận'} text="Thao tác này sẽ gửi thông báo đến khách hàng." onClose={() => setConfirm(null)} onConfirm={() => { setConfirm(null); ctx.notify(confirm === 'danger' ? 'Đã hủy booking' : 'Đã xác nhận booking') }} />}
  </div>
}
