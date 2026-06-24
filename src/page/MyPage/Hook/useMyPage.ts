import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { uploadImageToS3 } from "../../../api/s3Api";
import { toast } from "../../../store/toastStore";
import {
  getMyBookmarks,
  getMyCreatedRelays,
  getMyProfile,
  getMyRelays,
  updateMyProfile,
  withdrawMyAccount,
  type MyPageListParams,
  type MyPageRelayItem,
  type MyPageRelayListResponse,
  type MyProfile,
  type RelayTabType,
} from "../api/myPageApi";

const TAB_FETCHERS: Record<
  RelayTabType,
  (params?: MyPageListParams) => Promise<MyPageRelayListResponse>
> = {
  PARTICIPATED: getMyRelays,
  CREATED: getMyCreatedRelays,
  LIKED: getMyBookmarks,
};

const EMPTY_PROFILE: MyProfile = {
  id: 0,
  name: "",
  email: "",
  profileImage: "",
  participationCount: 0,
  createdCount: 0,
  likedCount: 0,
  provider: "",
  createdAt: "",
};

export const useMyPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState<MyProfile>(EMPTY_PROFILE);
  const [activeTab, setActiveTab] = useState<RelayTabType>("PARTICIPATED");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<MyPageRelayItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let active = true;

    TAB_FETCHERS[activeTab]({ page: currentPage - 1 })
      .then((response) => {
        if (!active) return;
        setItems(response.items);
        setTotalPages(Math.max(1, response.totalPages));
      })
      .catch((error) => console.log(error));

    return () => {
      active = false;
    };
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: RelayTabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const openEdit = () => {
    setEditName(profile.name);
    setEditImageFile(null);
    setEditImagePreview(profile.profileImage || null);
    setIsEditOpen(true);
  };

  const closeEdit = () => setIsEditOpen(false);

  const handleEditImageChange = (file: File | null) => {
    setEditImageFile(file);
    setEditImagePreview(file ? URL.createObjectURL(file) : profile.profileImage);
  };

  const submitEdit = async () => {
    if (isSubmittingEdit) return;
    setIsSubmittingEdit(true);
    try {
      const profileImage = editImageFile
        ? await uploadImageToS3(editImageFile, "PROFILE")
        : profile.profileImage;

      const updated = await updateMyProfile({ name: editName, profileImage });
      setProfile(updated);
      setIsEditOpen(false);
      toast.success("회원 정보가 수정되었습니다.");
      fetchProfile();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원 정보 수정에 실패했습니다.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsWithdrawing(true);
    try {
      const response = await withdrawMyAccount();
      toast.success(response.message ?? "회원 탈퇴가 완료되었습니다.");
      logout();
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.");
      setIsWithdrawing(false);
    }
  };

  return {
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
    isSubmittingEdit,
    isWithdrawing,
  };
};
