import axios from "axios";
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
    const response = await axios.get<Campaign[]>(
      `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails`
    );
    return response.data || [];
  } catch (err) {
    console.error("Error fetching campaigns:", err);
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
  try {
    const url = `${BASE_URL}/marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${campaignId}`;
    const finalUrl = userId ? `${url}&userId=${userId}` : url;

    const response = await axios.get(finalUrl, {
      headers: { accept: "*/*" },
    });

    if (response.status === 200) {
      return {
        likesTotalCount: response.data.likesTotalCount || 0,
        dislikesTotalCount: response.data.dislikesTotalCount || 0,
        subComments: response.data.subComments || [],
        likeStatus: response.data.likeStatus || "",
        subscribed: response.data.subscribed || "",
        isLiked: userId ? response.data.likeStatus === "yes" : false,
        isDisliked: userId ? response.data.likeStatus === "no" : false,
        isSubscribed: userId ? response.data.subscribed === "yes" : false,
      };
    }
  } catch (error) {
    console.error("Error fetching likes and comments:", error);
  }
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
};


export const submitWriteToUsQuery = async (
  email: string | null,
  mobileNumber: string | null,
  query: string,
  campaignType: string,
  userId: string | null
): Promise<boolean> => {
  const payload = {
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
  };

  const accessToken = localStorage.getItem("accessToken");

  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const response = await axios.post(
      `${BASE_URL}/user-service/write/saveData`,
      payload,
      { headers }
    );
    return response.data ? true : false;
  } catch (error) {
    console.error("Error sending the query:", error);
    return false;
  }
};

export const checkUserInterest = async (
  userId: string,
  campaignType: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/marketing-service/campgin/allOfferesDetailsForAUser`,
      { userId }
    );

    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.some(
        (offer: any) => offer.askOxyOfers === campaignType
      );
    }
    return false;
  } catch (error) {
    console.error("Error while fetching offers:", error);
    return false;
  }
};

export const submitInterest = async (
  campaignType: string,
  mobileNumber: string | null,
  userId: string | null,
  userRole: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
      {
        askOxyOfers: campaignType,
        mobileNumber,
        userId,
        projectType: "ASKOXY",
        userRole,
      }
    );
    if (response.status === 200) {
      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);
      return true;
    }
    return false;
  } catch (error) {
    console.error("API Error:", error);
    return false;
  }
};

export const submitUserInteraction = async (
  interaction:
    | {
        campaignId: string;
        interavtionType: "LIKEORDISLIKE";
        likeStatus: "yes" | "no";
        userId: string | null;
      }
    | {
        campaignId: string;
        interavtionType: "SUBSCRIBE";
        subscribed: "yes" | "no";
        userId: string | null;
      }
    | {
        campaignId: string;
        interavtionType: "COMMENTS";
        userComments: string;
        userId: string | null;
      }
): Promise<boolean> => {
  try {
    const payload = {
      campaignId: interaction.campaignId,
      userId: interaction.userId,
      interavtionType: interaction.interavtionType,
      likeStatus: interaction.interavtionType === "LIKEORDISLIKE" ? interaction.likeStatus : null,
      subscribed: interaction.interavtionType === "SUBSCRIBE" ? interaction.subscribed : null,
      userComments: interaction.interavtionType === "COMMENTS" ? interaction.userComments : null,
    };

    const response = await axios.post(
      `${BASE_URL}/marketing-service/campgin/filluserinteractions`,
      payload,
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error submitting user interaction:", error);
    return false;
  }
};

export const submitSubComment = async (
  mainCommentId: string,
  subComment: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/marketing-service/campgin/fillusersubinteractioncomments`,
      {
        mainCommentId,
        subComment,
        userId,
      },
      { headers: { accept: "*/*", "Content-Type": "application/json" } }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error submitting sub-comment:", error);
    return false;
  }
};
