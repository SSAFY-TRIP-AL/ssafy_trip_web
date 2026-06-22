import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, MapPin, UploadCloud, X } from "lucide-react";
import "../../../../style.css";
import "../../../auth/auth.css";
import registerStyle from "../css/RegisterDesktop.module.css";
import { useRegisterRelay } from "../Hook/useRegisterRelay";
import { useLocationSearch } from "../Hook/useLocationSearch";
import { useCategories } from "../../../../hooks/useCategories";
import { getCategoryStyle } from "../../../../constants/categoryPalette";

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export default function RegisterDesktop() {
  const {
    address,
    setAddress,
    latitude,
    longitude,
    suggestions,
    isSuggestionsOpen,
    setIsSuggestionsOpen,
    isLocating,
    selectSuggestion,
    findCurrentLocation,
  } = useLocationSearch();

  const {
    title,
    setTitle,
    categoryId,
    setCategoryId,
    content,
    setContent,
    imagePreview,
    handleImageChange,
    handleSubmit,
  } = useRegisterRelay({ address, latitude, longitude });
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const location = useLocation();
  const isStepAdd = location.pathname === "/relaystepadd";
  const { categories } = useCategories(!isStepAdd);
  const categoryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSuggestionsOpen]);

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    if (file) handleImageChange(file);
  }

  return (
    <div className="container">
      <div className={registerStyle.container}>
        {!isStepAdd ? (
          <>
            <span className="trip-h1">릴레이 등록</span>
            <span className={`trip-body1 ${registerStyle.titleText}`}>
              새로운 여행 릴레이를 등록해보세요.
            </span>
          </>
        ) : (
          <>
            <span className="trip-h1">릴레이 스텝 등록</span>
            <span className={`trip-body1 ${registerStyle.titleText}`}>
              당신이 여행한 장소를 등록해주세요.
            </span>
          </>
        )}
        <form onSubmit={handleSubmit} className={registerStyle.formContainer}>
          {!isStepAdd && (
            <>
              <div className="authField">
                <div className={registerStyle.fieldHeader}>
                  <label htmlFor="title">릴레이 제목</label>
                  <span className={registerStyle.charCount}>
                    {title.length}/{TITLE_MAX_LENGTH}
                  </span>
                </div>
                <div className="authInputBox">
                  <input
                    id="title"
                    type="text"
                    placeholder="릴레이 제목을 입력하세요"
                    value={title}
                    maxLength={TITLE_MAX_LENGTH}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="authField">
                <label>카테고리 선택</label>
                <div className={registerStyle.categoryWrapper} ref={categoryRef}>
                  <button
                    type="button"
                    className={registerStyle.categorySelect}
                    onClick={() => setIsCategoryOpen((prev) => !prev)}
                  >
                    {categoryId != null ? (
                      <span className={registerStyle.categorySelectValue}>
                        <span
                          className={registerStyle.categoryDot}
                          style={{
                            backgroundColor: getCategoryStyle(
                              categories.findIndex((c) => c.id === categoryId),
                            ).color,
                          }}
                        />
                        {categories.find((c) => c.id === categoryId)?.name}
                      </span>
                    ) : (
                      <span className={registerStyle.categoryPlaceholder}>
                        카테고리를 선택하세요
                      </span>
                    )}
                    <ChevronDown size={16} className={registerStyle.categoryChevron} />
                  </button>
                  {isCategoryOpen && (
                    <ul className={registerStyle.categoryMenu}>
                      {categories.map((category, index) => (
                        <li key={category.id}>
                          <button
                            type="button"
                            className={`${registerStyle.categoryOption} ${
                              categoryId === category.id ? registerStyle.categoryOptionActive : ""
                            }`}
                            onClick={() => {
                              setCategoryId(category.id);
                              setIsCategoryOpen(false);
                            }}
                          >
                            <span
                              className={registerStyle.categoryDot}
                              style={{
                                backgroundColor: getCategoryStyle(index).color,
                              }}
                            />
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="authField">
            <label>사진 업로드</label>
            <div
              className={registerStyle.uploadArea}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="업로드한 이미지"
                    className={registerStyle.uploadPreview}
                  />
                  <button
                    type="button"
                    className={registerStyle.uploadRemoveBtn}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleImageChange(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud size={32} className={registerStyle.uploadIcon} />
                  <span className={registerStyle.uploadText}>
                    이미지를 드래그하거나 클릭하여 업로드하세요
                  </span>
                  <span className={registerStyle.uploadHint}>PNG, JPG 파일 (최대 10MB)</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={registerStyle.uploadInput}
                onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="authField">
            <label htmlFor="location">위치 정보</label>

            <div className={registerStyle.locationRow}>
              <div className={`authInputBox ${registerStyle.locationInputBox}`} ref={locationRef}>
                <input
                  id="location"
                  type="text"
                  placeholder="여행 위치를 입력하세요"
                  value={address}
                  autoComplete="off"
                  onChange={(event) => setAddress(event.target.value)}
                  onFocus={() => suggestions.length > 0 && setIsSuggestionsOpen(true)}
                  required
                />
                {isSuggestionsOpen && suggestions.length > 0 && (
                  <ul className={registerStyle.locationSuggestions}>
                    {suggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button
                          type="button"
                          className={registerStyle.locationSuggestionItem}
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          <span className={registerStyle.locationSuggestionName}>
                            {suggestion.placeName}
                          </span>
                          <span className={registerStyle.locationSuggestionAddress}>
                            {suggestion.addressName}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                className={registerStyle.locationBtn}
                onClick={findCurrentLocation}
                disabled={isLocating}
              >
                <MapPin size={16} />
                {isLocating ? "찾는 중..." : "위치 찾기"}
              </button>
            </div>
          </div>

          <div className="authField">
            <div className={registerStyle.fieldHeader}>
              <label htmlFor="description">릴레이 설명</label>
              <span className={registerStyle.charCount}>
                {content.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="description"
              className={registerStyle.textarea}
              placeholder="릴레이에 대한 설명을 입력하세요"
              value={content}
              maxLength={DESCRIPTION_MAX_LENGTH}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>

          <div className={registerStyle.actions}>
            <button type="button" className={registerStyle.cancelBtn} onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit" className={registerStyle.submitBtn}>
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
