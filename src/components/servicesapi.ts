import axiosInstance from "../utils/axiosInstance";
import BASE_URL from "../Config";

export interface Image {
  imageId?: string;
  imageUrl?: string;
  status?: boolean;
}

export interface Campaign {
  campaignId: string;
  id?: string;
  campaignType?: string;
  campaignTitle?: string;
  campaignDescription: string;
  imageUrls?: Image[];
  imageUrl?: string;
  images?: { imageUrl?: string; status?: boolean }[];
  campaignTypeAddBy?: string;
  campaignStatus?: boolean;
  campainInputType?: string;
  createdAt?: number | string;
  createdPersonId?: string;
  addServiceType?: string;
  team1?: string | null;
  team2?: string | null;
  team3?: string | null;
  team4?: string | null;
  selectedTeam?: string | null;
  pollEndTime?: number | null;
  socialMediaCaption?: string;
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

export interface CampaignPollOption {
  key: "team1" | "team2" | "team3" | "team4";
  value: string;
}

export interface CampaignLikesAndCommentsResponse {
  campaignId?: string;
  likesTotalCount: number;
  dislikesTotalCount: number;
  subComments: Comment[];
  isLiked: boolean;
  isDisliked: boolean;
  isSubscribed: boolean;
  likeStatus: string;
  subscribed: string;
  selectedTeam: string;
  pollOptions: CampaignPollOption[];
  team1?: string;
  team2?: string;
  team3?: string;
  team4?: string;
  pollEndTime?: number | null;
}

const isValidPollValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim();

  return (
    normalized !== "" &&
    normalized !== "0" &&
    normalized.toLowerCase() !== "null" &&
    normalized.toLowerCase() !== "undefined"
  );
};

const buildPollOptions = (data: any): CampaignPollOption[] => {
  const options: CampaignPollOption[] = [];

  if (isValidPollValue(data?.team1)) {
    options.push({ key: "team1", value: String(data.team1).trim() });
  }
  if (isValidPollValue(data?.team2)) {
    options.push({ key: "team2", value: String(data.team2).trim() });
  }
  if (isValidPollValue(data?.team3)) {
    options.push({ key: "team3", value: String(data.team3).trim() });
  }
  if (isValidPollValue(data?.team4)) {
    options.push({ key: "team4", value: String(data.team4).trim() });
  }

  return options;
};

const normalizeCampaign = (item: any): Campaign => {
  const imageUrls: Image[] = Array.isArray(item?.imageUrls)
    ? item.imageUrls.map((img: any) =>
        typeof img === "string"
          ? { imageUrl: img, status: true }
          : {
              imageId: img?.imageId,
              imageUrl: img?.imageUrl,
              status: img?.status,
            }
      )
    : item?.imageUrl
    ? [{ imageUrl: item.imageUrl, status: true }]
    : Array.isArray(item?.images)
    ? item.images.map((img: any) => ({
        imageUrl: img?.imageUrl,
        status: img?.status,
      }))
    : [];

  return {
    campaignId: item?.campaignId || item?.id || "",
    id: item?.id || item?.campaignId || "",
    campaignType: item?.campaignType || item?.campaignTitle || "Blog",
    campaignTitle: item?.campaignTitle || item?.campaignType || "Blog",
    campaignDescription: item?.campaignDescription || "",
    imageUrls,
    imageUrl: item?.imageUrl || imageUrls?.[0]?.imageUrl || "",
    images: Array.isArray(item?.images) ? item.images : [],
    campaignTypeAddBy: item?.campaignTypeAddBy || "ADMIN",
    campaignStatus: item?.campaignStatus !== false,
    campainInputType: item?.campainInputType || "BLOG",
    createdAt: item?.createdAt || Date.now(),
    createdPersonId: item?.createdPersonId || "",
    addServiceType: item?.addServiceType || "",
    team1: item?.team1 ?? "",
    team2: item?.team2 ?? "",
    team3: item?.team3 ?? "",
    team4: item?.team4 ?? "",
    selectedTeam: item?.selectedTeam ?? "",
    pollEndTime: item?.pollEndTime ?? null,
    socialMediaCaption: item?.socialMediaCaption || "",
  };
};

const extractArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.response)) return data.response;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.campaigns)) return data.campaigns;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data } = await axiosInstance.get(
      `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails`
    );
    return extractArray(data).map(normalizeCampaign);
  } catch (error) {
    console.error("fetchCampaigns error:", error);
    return [];
  }
};

export const fetchAllGames = async (): Promise<Campaign[]> => {
  try {
    const { data } = await axiosInstance.get(
      `${BASE_URL}/marketing-service/campgin/get-all-games`
    );
    return extractArray(data).map(normalizeCampaign);
  } catch (error) {
    console.error("fetchAllGames error:", error);
    return [];
  }
};

export const fetchLikesAndComments = async (
  campaignId: string,
  userId: string | null
): Promise<CampaignLikesAndCommentsResponse> => {
  const url = userId
    ? `${BASE_URL}/marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${campaignId}&userId=${userId}`
    : `${BASE_URL}/marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${campaignId}`;

  try {
    const { data } = await axiosInstance.get(url);
    const pollOptions = buildPollOptions(data);

    return {
      campaignId: data?.campaignId || campaignId,
      likesTotalCount: data?.likesTotalCount || 0,
      dislikesTotalCount: data?.dislikesTotalCount || 0,
      subComments: data?.subComments || [],
      likeStatus: data?.likeStatus || "",
      subscribed: data?.subscribed || "",
      isLiked: userId ? data?.likeStatus === "yes" : false,
      isDisliked: userId ? data?.likeStatus === "no" : false,
      isSubscribed: userId ? data?.subscribed === "yes" : false,
      selectedTeam: data?.selectedTeam || "",
      pollOptions,
      team1: isValidPollValue(data?.team1) ? String(data.team1).trim() : "",
      team2: isValidPollValue(data?.team2) ? String(data.team2).trim() : "",
      team3: isValidPollValue(data?.team3) ? String(data.team3).trim() : "",
      team4: isValidPollValue(data?.team4) ? String(data.team4).trim() : "",
      pollEndTime:
        data?.pollEndTime !== undefined && data?.pollEndTime !== null
          ? Number(data.pollEndTime)
          : null,
    };
  } catch (error) {
    console.error("fetchLikesAndComments error:", error);
    return {
      campaignId,
      likesTotalCount: 0,
      dislikesTotalCount: 0,
      subComments: [],
      likeStatus: "",
      subscribed: "",
      isLiked: false,
      isDisliked: false,
      isSubscribed: false,
      selectedTeam: "",
      pollOptions: [],
      team1: "",
      team2: "",
      team3: "",
      team4: "",
      pollEndTime: null,
    };
  }
};

export const submitWriteToUsQuery = async (
  email: string,
  mobileNumber: string,
  query: string,
  campaignType: string,
  userId: string
): Promise<boolean> => {
  try {
    const { data } = await axiosInstance.post(
      `${BASE_URL}/marketing-service/campgin/addAskOxyQueries`,
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
  } catch (error) {
    console.error("submitWriteToUsQuery error:", error);
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
      if (match) {
        return { exists: true, userRole: match.userRole };
      }
    }

    return { exists: false };
  } catch (error) {
    console.error("checkUserInterest error:", error);
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
      {
        askOxyOfers: campaignType,
        mobileNumber,
        userId,
        projectType: "ASKOXY",
        userRole,
      }
    );

    if (status === 200) {
      if (data?.askOxyOfers) {
        localStorage.setItem("askOxyOfers", data.askOxyOfers);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("submitInterest error:", error);
    return false;
  }
};

type InteractionPayload = {
  campaignId: string;
  interavtionType: "COMMENTS" | "LIKEORDISLIKE" | "SUBSCRIBE" | "POOLING";
  userId: string | null;
  likeStatus?: string;
  pollAnswer?: string;
  subscribed?: string;
  userComments?: string;
};

export const submitUserInteraction = async (
  interaction: InteractionPayload
): Promise<boolean> => {
  try {
    const payload: Record<string, any> = {
      campaignId: interaction.campaignId,
      id: interaction.campaignId,
      interavtionType: interaction.interavtionType,
      status: true,
      userId: interaction.userId ?? "",
    };

    if (interaction.interavtionType === "LIKEORDISLIKE") {
      payload.likeStatus = interaction.likeStatus ?? "";
    }

    if (interaction.interavtionType === "POOLING") {
      payload.pollAnswer = interaction.pollAnswer ?? "";
    }

    if (interaction.interavtionType === "SUBSCRIBE") {
      payload.subscribed = interaction.subscribed ?? "";
    }

    if (interaction.interavtionType === "COMMENTS") {
      payload.userComments = interaction.userComments ?? "";
    }

    const { status } = await axiosInstance.post(
      `${BASE_URL}/marketing-service/campgin/filluserinteractions`,
      payload
    );

    return status === 200 || status === 201;
  } catch (error) {
    console.error("submitUserInteraction error:", error);
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
  } catch (error) {
    console.error("submitSubComment error:", error);
    return false;
  }
};

export const fetchAppliedJobsByUserId = async (
  userId: string | null
): Promise<AppliedJob[]> => {
  if (!userId) return [];

  try {
    const { data } = await axiosInstance.get(
      `${BASE_URL}/marketing-service/campgin/get-user-apply-jobs`,
      { params: { userId } }
    );
    return data?.data || [];
  } catch (error) {
    console.error("fetchAppliedJobsByUserId error:", error);
    return [];
  }
};