import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../Config";

interface GmailAuthData {
  signInUrl?: string;
}

interface Contact {
  contactName?: string | null;
  emailAddress: string;
  mobileNumber?: string | null;
}

interface ContactsResponse {
  contacts: Contact[];
}

type ModalType = "success" | "error" | "";

const GmailContactsScreen: React.FC = () => {
  const [authData, setAuthData] = useState<GmailAuthData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [contactsResponse, setContactsResponse] =
    useState<ContactsResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(true);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sendingInvites, setSendingInvites] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>("");
  const [modalMessage, setModalMessage] = useState<string>("");

  const USER_ID: string = localStorage.getItem("userId") ?? "";

  // Step 1: Call GET API to get Gmail sign-in URL
  const handleGetAuthorization = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get<GmailAuthData>(
        `${BASE_URL}/user-service/getGmailAuthorization/gmailcontacts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setAuthData(res.data);

      if (res.data?.signInUrl) {
        window.open(res.data.signInUrl, "_self");
      }
    } catch (err) {
      console.error("GET Authorization Error:", err);
      alert("Failed to get Gmail Authorization");
    } finally {
      setLoading(false);
    }
  };

  // Check if Gmail is already connected
  const checkGmailConnection = async (): Promise<void> => {
    try {
      setCheckingConnection(true);
      const res = await axios.get<Contact[]>(
        `${BASE_URL}/user-service/gmail/contacts/${USER_ID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        setIsConnected(true);
        setContactsResponse({ contacts: res.data });
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Check Connection Error:", err);
      setIsConnected(false);
    } finally {
      setCheckingConnection(false);
    }
  };

  // Step 3: Send the Gmail code to backend POST API
  const sendCodeToBackend = async (gmailCode: string): Promise<void> => {
    try {
      const payload = {
        gmailCode,
        gmailRedirectUri:
          "https://www.askoxy.ai/main/google",
        userType: "USER",
      };

      const res = await axios.post<Contact[]>(
        `${BASE_URL}/user-service/getContactsFromGmailAccount/${USER_ID}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        setContactsResponse({ contacts: res.data });
        setIsConnected(true);
        alert("Contacts fetched successfully");
      }
    } catch (err) {
      console.error("POST Fetch Contacts Error:", err);
      alert("Failed to fetch contacts");
    }
  };

  // Step 2: If redirected back from Google with ?code=XXXX, extract it
  useEffect(() => {
    checkGmailConnection();

    const urlParams = new URLSearchParams(window.location.search);
    const gmailCode = urlParams.get("code");

    if (gmailCode) {
      void sendCodeToBackend(gmailCode);
    }
  }, []);

  const SpinnerInline = ({ size = "md" }: { size?: "sm" | "md" }) => {
    const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";
    return (
      <div
        className={`inline-block ${dimension} animate-spin rounded-full border-2 border-gray-300 border-t-gray-700`}
      />
    );
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto">
      <div className="bg-white shadow-md rounded-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-envelope mr-2" />
            Gmail Contacts
          </h3>
          {checkingConnection ? (
            <SpinnerInline size="sm" />
          ) : (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <i
                className={`fas ${
                  isConnected ? "fa-check-circle" : "fa-times-circle"
                } mr-1`}
              />
              {isConnected ? "Connected" : "Not Connected"}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 bg-white">
          {checkingConnection ? (
            <div className="text-center py-10">
              <div className="mb-3 flex justify-center">
                <SpinnerInline />
              </div>
              <p className="text-gray-700">
                Checking Gmail connection status...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                {isConnected ? (
                  <>
                    <div className="mb-3 flex justify-center">
                      <i
                        className="fas fa-check-circle text-green-500"
                        style={{ fontSize: "3rem" }}
                      />
                    </div>
                    <h5 className="text-green-600 text-lg font-semibold mb-2">
                      Gmail Connected Successfully!
                    </h5>
                    <p className="text-gray-700 mb-4">
                      Your Gmail account is connected. You can refresh contacts
                      or reconnect if needed.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={handleGetAuthorization}
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 rounded-md border text-sm font-medium transition ${
                          loading
                            ? "border-red-300 text-red-300 bg-white cursor-not-allowed"
                            : "border-red-500 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <i className="fab fa-google mr-2" />
                        Google Contacts
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3 flex justify-center">
                      <i
                        className="fab fa-google text-red-500"
                        style={{ fontSize: "3rem" }}
                      />
                    </div>
                    <h5 className="text-gray-900 text-lg font-semibold mb-2">
                      Connect Your Gmail Account
                    </h5>
                    <p className="text-gray-700 mb-4">
                      Connect your Gmail account to import and manage your
                      contacts seamlessly.
                    </p>
                    <button
                      type="button"
                      onClick={handleGetAuthorization}
                      disabled={loading}
                      className={`inline-flex items-center px-6 py-2 rounded-md text-sm font-semibold text-white shadow-sm transition ${
                        loading
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {loading ? (
                        <>
                          <SpinnerInline size="sm" />
                          <span className="ml-2">Connecting...</span>
                        </>
                      ) : (
                        <>
                          <i className="fab fa-google mr-2" />
                          Connect Gmail Account
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Contacts list */}
          {contactsResponse && isConnected && (
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              {/* Contacts header */}
              <div className="px-5 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-gray-900 font-semibold flex items-center">
                    <i className="fas fa-address-book mr-2" />
                    Your Gmail Contacts
                  </h5>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {contactsResponse?.contacts?.length || 0} contacts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center text-sm text-gray-800">
                    <input
                      type="checkbox"
                      id="select-all"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2 focus:ring-blue-500"
                      checked={selectAll}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => {
                        const checked = e.target.checked;
                        setSelectAll(checked);
                        if (checked && contactsResponse?.contacts) {
                          setSelectedContacts(
                            contactsResponse.contacts.map((_, index) => index)
                          );
                        } else {
                          setSelectedContacts([]);
                        }
                      }}
                    />
                    Select All
                  </label>
                  <button
                    type="button"
                    disabled={
                      selectedContacts.length === 0 || sendingInvites
                    }
                    onClick={async (): Promise<void> => {
                      setSendingInvites(true);
                      try {
                        if (!contactsResponse?.contacts) return;

                        const selectedContactsData = selectedContacts.map(
                          (index) => {
                            const contact = contactsResponse.contacts[index];
                            return {
                              email: contact.emailAddress,
                              name:
                                contact.contactName || contact.emailAddress,
                            };
                          }
                        );

                        await axios.post(
                          `${BASE_URL}/user-service/sendInvitation/${USER_ID}`,
                          selectedContactsData,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                              )}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );

                        setModalType("success");
                        setModalMessage(
                          `Invites sent successfully to ${selectedContacts.length} contacts!`
                        );
                        setShowModal(true);
                        setSelectedContacts([]);
                        setSelectAll(false);
                      } catch (error) {
                        console.error("Error sending invites:", error);
                        setModalType("error");
                        setModalMessage(
                          "Failed to send invites. Please try again."
                        );
                        setShowModal(true);
                      } finally {
                        setSendingInvites(false);
                      }
                    }}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium shadow-sm transition ${
                      selectedContacts.length === 0 || sendingInvites
                        ? "bg-green-300 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {sendingInvites ? (
                      <>
                        <SpinnerInline size="sm" />
                        <span className="ml-2">Sending...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2" />
                        Send Invites ({selectedContacts.length})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Contacts body */}
              <div className="bg-white">
                {contactsResponse?.contacts?.length > 0 ? (
                  <div>
                    {contactsResponse.contacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex items-center py-3 px-5 border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          id={`contact-${index}`}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-3 focus:ring-blue-500"
                          checked={selectedContacts.includes(index)}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ): void => {
                            const checked = e.target.checked;
                            if (checked) {
                              setSelectedContacts((prev) => [
                                ...prev,
                                index,
                              ]);
                            } else {
                              setSelectedContacts((prev) =>
                                prev.filter((i) => i !== index)
                              );
                              setSelectAll(false);
                            }
                          }}
                        />
                        <div className="flex items-center mr-3">
                          <div className="bg-blue-600 text-white rounded-full flex items-center justify-center h-10 w-10">
                            <i className="fas fa-user" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <strong className="block text-gray-900 text-sm">
                            {contact.contactName || "No Name"}
                          </strong>
                          <small className="block text-gray-500">
                            {contact.emailAddress}
                          </small>
                          {contact.mobileNumber && (
                            <small className="block text-gray-500">
                              {contact.mobileNumber}
                            </small>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <i
                      className="fas fa-inbox text-gray-400"
                      style={{ fontSize: "2rem" }}
                    />
                    <p className="text-gray-700 mt-2 mb-0">
                      No contacts found in your Gmail account.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center text-gray-900 font-semibold">
                <i
                  className={`fas ${
                    modalType === "success"
                      ? "fa-check-circle text-green-500"
                      : "fa-exclamation-triangle text-red-500"
                  } mr-2`}
                />
                {modalType === "success" ? "Success" : "Error"}
              </div>
              <button
                type="button"
                onClick={(): void => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>
            <div className="px-4 py-4">
              <p className="text-gray-800">{modalMessage}</p>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={(): void => setShowModal(false)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
                  modalType === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailContactsScreen;
