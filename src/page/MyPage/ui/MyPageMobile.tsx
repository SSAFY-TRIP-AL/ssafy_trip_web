import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Flag,
  Heart,
  LogOut,
  Send,
  Trash2,
  X,
} from "lucide-react";
import "../../../style.css";
import "../../auth/auth.css";
import myPageStyle from "../css/MyPageMobile.module.css";
import { useMyPage } from "../Hook/useMyPage";
import type { RelayTabType } from "../api/myPageApi";

const TABS: { id: RelayTabType; label: string; description: string }[] = [
  {
    id: "PARTICIPATED",
    label: "참여한 릴레이",
    description: "내가 참여한 릴레이 목록입니다.",
  },
  {
    id: "CREATED",
    label: "시작한 릴레이",
    description: "내가 시작한 릴레이 목록입니다.",
  },
  {
    id: "LIKED",
    label: "좋아요한 릴레이",
    description: "내가 좋아요한 릴레이 목록입니다.",
  },
];

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

export default function MyPageMobile() {
  const {
    profile,
    activeTab,
    handleTabChange,
    items,
    currentPage,
    setCurrentPage,
    totalPages,
    isEditOpen,
    editName,
    setEditName,
    editImagePreview,
    openEdit,
    closeEdit,
    handleEditImageChange,
    submitEdit,
    handleLogout,
    handleWithdraw,
  } = useMyPage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTab = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className={myPageStyle.container}>
      <div className={myPageStyle.title}>
        <span className="trip-h2">마이 페이지</span>
        <span className="trip-body2">
          나의 여행 릴레이 활동을 관리하고 확인하세요.
        </span>
      </div>

      <div className={myPageStyle.profileCard}>
        <div className={myPageStyle.profileLeft}>
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className={myPageStyle.profileImg}
            />
          ) : (
            <div className={myPageStyle.profileImg} />
          )}
          <div className={myPageStyle.profileInfo}>
            <span className="trip-h3">{profile.name}</span>
            {profile.createdAt && (
              <span className={myPageStyle.joinedAt}>
                {profile.createdAt} 가입
              </span>
            )}
          </div>
        </div>
        <button type="button" className={myPageStyle.editBtn} onClick={openEdit}>
          정보 수정
        </button>
      </div>

      <div className={myPageStyle.statsRow}>
        <div className={myPageStyle.statItem}>
          <Send size={18} className={myPageStyle.statIcon} />
          <span className="trip-body2">참여한 릴레이</span>
          <span className="trip-h2">{profile.participationCount}</span>
        </div>
        <div className={myPageStyle.statItem}>
          <Flag size={18} className={myPageStyle.statIcon} />
          <span className="trip-body2">시작한 릴레이</span>
          <span className="trip-h2">{profile.createdCount}</span>
        </div>
        <div className={myPageStyle.statItem}>
          <Heart size={18} className={myPageStyle.statIcon} />
          <span className="trip-body2">좋아요한 릴레이</span>
          <span className="trip-h2">{profile.likedCount}</span>
        </div>
      </div>

      <div className={myPageStyle.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${myPageStyle.tabBtn} ${
              activeTab === tab.id ? myPageStyle.tabBtnActive : ""
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <span className={myPageStyle.tabDescription}>{currentTab.description}</span>

      <div className={myPageStyle.relayList}>
        {items.length === 0 ? (
          <div className={myPageStyle.emptyState}>아직 표시할 릴레이가 없습니다.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={myPageStyle.relayCard}
              onClick={() => navigate(`/relay/detail/${item.id}`)}
            >
              <div className={myPageStyle.relayImageWrap}>
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className={myPageStyle.relayImage}
                  />
                ) : (
                  <div className={myPageStyle.relayImagePlaceholder} />
                )}
              </div>
              <div className={myPageStyle.relayBody}>
                <span className={myPageStyle.relayTitle}>{item.title}</span>
                <p className={myPageStyle.relayDescription}>{item.content}</p>
                <span className={myPageStyle.relayDateValue}>{item.date}</span>
              </div>
              <ChevronRight size={18} className={myPageStyle.relayChevron} />
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={myPageStyle.pagination}>
          <button
            type="button"
            className={myPageStyle.pageArrowBtn}
            aria-label="이전 페이지"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className={myPageStyle.pageEllipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`${myPageStyle.pageBtn} ${
                  currentPage === page ? myPageStyle.pageBtnActive : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ),
          )}
          <button
            type="button"
            className={myPageStyle.pageArrowBtn}
            aria-label="다음 페이지"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <div className={myPageStyle.accountPanel}>
        <span className="trip-h3">계정</span>
        <button type="button" className={myPageStyle.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} />
          로그아웃
        </button>
        <button type="button" className={myPageStyle.withdrawBtn} onClick={handleWithdraw}>
          <Trash2 size={16} />
          회원 탈퇴
        </button>
      </div>

      {isEditOpen && (
        <div className={myPageStyle.modalOverlay} onClick={closeEdit}>
          <div className={myPageStyle.modalBox} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={myPageStyle.modalCloseBtn} onClick={closeEdit}>
              <X size={18} />
            </button>
            <span className="trip-h3">회원 정보 수정</span>

            <div className={myPageStyle.modalAvatarField}>
              <div
                className={myPageStyle.modalAvatarUpload}
                onClick={() => fileInputRef.current?.click()}
              >
                {editImagePreview ? (
                  <img
                    src={editImagePreview}
                    alt="프로필 이미지"
                    className={myPageStyle.modalAvatarPreview}
                  />
                ) : (
                  <div className={myPageStyle.modalAvatarPlaceholder} />
                )}
                <span className={myPageStyle.modalAvatarEditBtn}>
                  <Camera size={14} />
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={myPageStyle.modalAvatarInput}
                  onChange={(event) => handleEditImageChange(event.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="authField">
              <label htmlFor="editName">이름</label>
              <div className="authInputBox">
                <input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            <div className={myPageStyle.modalActions}>
              <button type="button" className={myPageStyle.modalCancelBtn} onClick={closeEdit}>
                취소
              </button>
              <button type="button" className={myPageStyle.modalSubmitBtn} onClick={submitEdit}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
