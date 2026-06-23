import { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import "../../../../style.css";
import relayListStyle from "../css/RelayListDesktop.module.css";
import { useRelayList } from "../Hook/useRelayList";
import { RELAY_SORT_OPTIONS } from "../api/relayApi";
import { useCategories } from "../../../../hooks/useCategories";
import { getCategoryStyle } from "../../../../constants/categoryPalette";
import RelayCard from "../../../../components/RelayCard/RelayCard";

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

export default function RelayListDesktop() {
  const {
    keyword,
    setKeyword,
    category,
    setCategory,
    orderBy,
    setOrderBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    items,
    totalCount,
    totalPages,
  } = useRelayList();
  const { categories } = useCategories();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortLabel = RELAY_SORT_OPTIONS.find((option) => option.id === orderBy)?.label ?? "최신순";
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="container">
      <div className={relayListStyle.title}>
        <span className="trip-h1">릴레이 목록</span>
        <span className="trip-body1">
          전 세계 사용자들이 이어가는 여행 릴레이를 탐색하고 참여해보세요.
        </span>
      </div>

      <div className={relayListStyle.filterBox}>
        <div className={relayListStyle.filterRow}>
          <div className={relayListStyle.searchInputBox}>
            <Search size={18} className={relayListStyle.searchIcon} />
            <input
              type="text"
              placeholder="릴레이 제목, 목적지, 키워드 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className={relayListStyle.dropdownWrapper} ref={categoryRef}>
            <button
              type="button"
              className={relayListStyle.dropdownBtn}
              onClick={() => {
                setIsCategoryOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
            >
              <span className={relayListStyle.dropdownBtnContent}>
                {category !== null && (
                  <span
                    className={relayListStyle.categoryDot}
                    style={{
                      backgroundColor: getCategoryStyle(
                        categories.findIndex((item) => item.id === category),
                      ).color,
                    }}
                  />
                )}
                {category === null
                  ? "카테고리 전체"
                  : categories.find((item) => item.id === category)?.name}
              </span>
              <ChevronDown size={16} />
            </button>
            {isCategoryOpen && (
              <ul className={relayListStyle.dropdownMenu}>
                <li>
                  <button
                    type="button"
                    className={`${relayListStyle.dropdownOption} ${
                      category === null ? relayListStyle.dropdownOptionActive : ""
                    }`}
                    onClick={() => {
                      setCategory(null);
                      setIsCategoryOpen(false);
                    }}
                  >
                    전체
                  </button>
                </li>
                {categories.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${relayListStyle.dropdownOption} ${
                        category === item.id ? relayListStyle.dropdownOptionActive : ""
                      }`}
                      onClick={() => {
                        setCategory(item.id);
                        setIsCategoryOpen(false);
                      }}
                    >
                      <span
                        className={relayListStyle.categoryDot}
                        style={{
                          backgroundColor: getCategoryStyle(index).color,
                        }}
                      />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={relayListStyle.dropdownWrapper} ref={sortRef}>
            <button
              type="button"
              className={relayListStyle.dropdownBtn}
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsCategoryOpen(false);
              }}
            >
              <span>{sortLabel}</span>
              <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <ul className={relayListStyle.dropdownMenu}>
                {RELAY_SORT_OPTIONS.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className={`${relayListStyle.dropdownOption} ${
                        orderBy === option.id ? relayListStyle.dropdownOptionActive : ""
                      }`}
                      onClick={() => {
                        setOrderBy(option.id);
                        setIsSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={relayListStyle.viewToggle}>
            <button
              type="button"
              aria-label="그리드로 보기"
              className={`${relayListStyle.viewToggleBtn} ${
                viewMode === "grid" ? relayListStyle.viewToggleBtnActive : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              aria-label="리스트로 보기"
              className={`${relayListStyle.viewToggleBtn} ${
                viewMode === "list" ? relayListStyle.viewToggleBtnActive : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        <span className={relayListStyle.resultCount}>총 {totalCount}개의 릴레이가 있습니다.</span>
      </div>

      <div className={viewMode === "grid" ? relayListStyle.cardGrid : relayListStyle.cardListWrap}>
        {items.map((relay) => (
          <RelayCard
            key={relay.id}
            id={relay.id}
            title={relay.title}
            description={`참여자 ${relay.participantCount}명`}
            imageUrl={relay.photoUrl}
            categoryName={relay.category}
            categoryStyle={getCategoryStyle(
              categories.findIndex((c) => c.name === relay.category),
            )}
            variant={viewMode === "grid" ? "grid" : "row"}
            showBookmark
            initialBookmarked={relay.bookmarked}
          />
        ))}
      </div>

      <div className={relayListStyle.pagination}>
        <button
          type="button"
          className={relayListStyle.pageArrowBtn}
          aria-label="이전 페이지"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className={relayListStyle.pageEllipsis}>
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${relayListStyle.pageBtn} ${
                currentPage === page ? relayListStyle.pageBtnActive : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          className={relayListStyle.pageArrowBtn}
          aria-label="다음 페이지"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
