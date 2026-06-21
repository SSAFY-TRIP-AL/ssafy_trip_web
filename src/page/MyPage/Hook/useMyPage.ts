import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { uploadImageToS3 } from "../../../api/s3Api";
import {
  getMyProfile,
  getMyRelays,
  updateMyProfile,
  withdrawMyAccount,
  type MyPageRelayItem,
  type MyProfile,
  type RelayTabType,
} from "../api/myPageApi";

const PAGE_SIZE = 5;

const EMPTY_PROFILE: MyProfile = {
  id: 0,
  name: "",
  profileImage: "",
  bio: "",
  joinedAt: "",
  participatedCount: 0,
  createdCount: 0,
  likedCount: 0,
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
  const [editImagePreview, setEditImagePreview] = useState<string | null>(
    null,
  );

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

    getMyRelays(activeTab, currentPage, PAGE_SIZE)
      .then((response) => {
        if (!active) return;
        setItems(response.items);
        setTotalPages(response.totalPages);
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
    try {
      const profileImage = editImageFile
        ? await uploadImageToS3(editImageFile, "PROFILE")
        : profile.profileImage;

      const updated = await updateMyProfile({ name: editName, profileImage });
      setProfile(updated);
      setIsEditOpen(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원 정보 수정에 실패했습니다.",
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleWithdraw = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      await withdrawMyAccount();
      logout();
      navigate("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.");
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
  };
};
