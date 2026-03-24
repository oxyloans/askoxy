import axiosInstance from "../utils/axiosInstance";
import BASE_URL from "../Config";

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

export interface Campaign {
  campaignId: string;
  campaignType: string;
  campaignDescription: string;
  imageUrls: Image[];
  campaignTypeAddBy: string;
  campaignStatus: boolean;
  campainInputType: string;
}

export interface AppliedJob {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string | null;
  noticePeriod: string | null;
  applicationStatus: string | null;
  resumeUrl: string;
  mobileNumber: string | null;
  userName: string | null;
  appliedAt: number;
  updatedAt: number;
  message: string | null;
  status: boolean;
}

interface Comment {
  mainComment: string;
  mainCommentId: string;
  subComments: SubComment[];
}

interface SubComment {
  userId: string;
  comment: string;
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data } = await axiosInstance.get<Campaign[]>(
      `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails`
    );
    return data || [];
  } catch {
    return [];
  }
};

export const fetchLikesAndComments = async (
  campaignId: string,
  userId: string | null
): Promise<{
  likesTotalCount: number;
  dislikesTotalCount: number;
  subComments: Comment[];
  isLiked: boolean;
  isDisliked: boolean;
  isSubscribed: boolean;
  likeStatus: string;
  subscribed: string;
}> => {
  const url = userId
    ? `${BASE_URL}/marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${campaignId}&userId=${userId}`
    : `${BASE_URL}/marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${campaignId}`;

  try {
    const { data } = await axiosInstance.get(url);
    return {
      likesTotalCount: data.likesTotalCount || 0,
      dislikesTotalCount: data.dislikesTotalCount || 0,
      subComments: data.subComments || [],
      likeStatus: data.likeStatus || "",
      subscribed: data.subscribed || "",
      isLiked: userId ? data.likeStatus === "yes" : false,
      isDisliked: userId ? data.likeStatus === "no" : false,
      isSubscribed: userId ? data.subscribed === "yes" : false,
    };
  } catch {
    return {
      likesTotalCount: 0,
      dislikesTotalCount: 0,
      subComments: [],
      isLiked: false,
      isDisliked: false,
      isSubscribed: false,
      likeStatus: "",
      subscribed: "",
    };
  }
};

export const submitWriteToUsQuery = async (
  email: string | null,
  mobileNumber: string | null,
  query: string,
  campaignType: string,
  userId: string | null
): Promise<boolean> => {
  try {
    const { data } = await axiosInstance.post(
      `${BASE_URL}/user-service/write/saveData`,
      {
        email,
        mobileNumber,
        queryStatus: "PENDING",
        projectType: "ASKOXY",
        askOxyOfers: campaignType,
        adminDocumentId: "",
        comments: "",
        id: "",
        resolvedBy: "",
        resolvedOn: "",
        status: "",
        userDocumentId: "",
        query,
        userId,
      }
    );
    return !!data;
  } catch {
    return false;
  }
};

export const checkUserInterest = async (
  userId: string,
  campaignType: string
): Promise<{ exists: boolean; userRole?: string }> => {
  try {
    const { data, status } = await axiosInstance.post(
      `${BASE_URL}/marketing-service/campgin/allOfferesDetailsForAUser`,
      { userId }
    );
    if (status === 200 && Array.isArray(data)) {
      const match = data.find((offer: any) => offer.askOxyOfers === campaignType);
      if (match) return { exists: true, userRole: match.userRole };
    }
    return { exists: false };
  } catch {
    return { exists: false };
  }
};

export const submitInterest = async (
  campaignType: string,
  mobileNumber: string | null,
  userId: string | null,
  userRole: string
): Promise<boolean> => {
  try {
    const { status, data } = await axiosInstance.post(
      `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
      { askOxyOfers: campaignType, mobileNumber, userId, projectType: "ASKOXY", userRole }
    );
    if (status === 200) {
      localStorage.setItem("askOxyOfers", data.askOxyOfers);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const submitUserInteraction = async (
  interaction:
    | { campaignId: string; interavtionType: "LIKEORDISLIKE"; likeStatus: "yes" | "no"; userId: string | null }
    | { campaignId: string; interavtionType: "SUBSCRIBE"; subscribed: "yes" | "no"; userId: string | null }
    | { campaignId: string; interavtionType: "COMMENTS"; userComments: string; userId: string | null }
): Promise<boolean> => {
  try {
    const payload = {
      campaignId: interaction.campaignId,
      userId: interaction.userId,
      interavtionType: interaction.interavtionType,
      likeStatus: interaction.interavtionType === "LIKEORDISLIKE" ? (interaction as any).likeStatus : null,
      subscribed: interaction.interavtionType === "SUBSCRIBE" ? (interaction as any).subscribed : null,
      userComments: interaction.interavtionType === "COMMENTS" ? (interaction as any).userComments : null,
    };
    const { status } = await axiosInstance.post(
      `${BASE_URL}/marketing-service/campgin/filluserinteractions`,
      payload
    );
    return status === 200;
  } catch {
    return false;
  }
};

export const submitSubComment = async (
  mainCommentId: string,
  subComment: string,
  userId: string
): Promise<boolean> => {
  try {
    const { status } = await axiosInstance.post(
      `${BASE_URL}/marketing-service/campgin/fillusersubinteractioncomments`,
      { mainCommentId, subComment, userId }
    );
    return status === 200;
  } catch {
    return false;
  }
};

export const fetchAppliedJobsByUserId = async (
  userId: string | null
): Promise<AppliedJob[]> => {
  if (!userId) return [];
  try {
    const { data } = await axiosInstance.get<any>(
      `${BASE_URL}/marketing-service/campgin/get-user-apply-jobs`,
      { params: { userId } },
    );
    // The response is { data: AppliedJob[], total: number, userId: string }
    return data?.data || [];
  } catch {
    return [];
  }
};
