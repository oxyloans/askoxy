import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Empty, Input, Spin, Table, Tag, Tooltip } from "antd";
import {
    AppstoreOutlined,
    FileTextOutlined,
    GlobalOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    ReloadOutlined,
    SearchOutlined,
    ShopOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";

interface Company {
    id: string;
    companyName: string;
    companyDescription?: string;
    locations?: string;
    websiteUrl?: string;
    logoUrl?: string;
    gstNumber?: string;
    gstDocumentUrl?: string;
    status?: boolean;
    linkedinUrl?: string;
}

interface ProductOrService {
    id: string;
    name: string;
    description?: string;
    category?: string;
    subCategory?: string;
    price?: number;
    mrp?: number;
    availability?: string;
    stockQuantity?: number;
    quantity?: number;
    quantityUnit?: string;
    imageUrl?: string;
    serviceMode?: string | null;
    serviceLocation?: string | null;
    serviceDuration?: string | null;
    priceType?: string;
    brand?: string;
    variant?: string | null;
    productCondition?: string;
    returnAvailable?: boolean;
    warrantyAvailable?: boolean;
    deliveryTime?: string;
    warrantyPeriod?: string | null;
    returnDays?: number | null;
    providerName?: string | null;
    businessName?: string | null;
    bookingRequired?: boolean | null;
    cancellationPolicy?: string | null;
    refundPolicy?: string | null;
    gstDocumentUrl?: string | null;
}

interface CompanyListing {
    name: string;
    email: string;
    mobileNumber: string;
    company: Company;
    products: ProductOrService[];
    services: ProductOrService[];
}

interface CompanyListingResponse {
    status: boolean;
    data: CompanyListing[];
    totalPages: number;
    totalElements: number;
    size: number;
    page: number;
    message?: string;
}

const PAGE_SIZE = 10;
const LIST_ENDPOINT = `${BASE_URL}/marketing-service/campgin/company-product-service-admin`;

const formatPrice = (value?: number) =>
    typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : "—";

const isValidImageUrl = (url?: string | null): boolean => {
    if (!url) return false;
    const clean = url.trim();
    return clean !== "" && clean !== "null" && clean !== "undefined";
};

const ListingTable: React.FC<{
    items: ProductOrService[];
    type: "Product" | "Service";
}> = ({ items, type }) => {
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 190,
            render: (name: string, item: ProductOrService) => (
                <div className="flex items-center gap-2.5">
                    {isValidImageUrl(item.imageUrl) && (
                        <img
                            src={item.imageUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-md border border-slate-200 object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                        />
                    )}
                    <Tooltip title={item.description || name}>
                        <span className="font-medium text-slate-800">{name || "Unnamed item"}</span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Category",
            key: "category",
            width: 150,
            render: (_: unknown, item: ProductOrService) => (
                <span className="text-xs text-slate-600">
                    {[item.category, item.subCategory].filter(Boolean).join(" / ") || "—"}
                </span>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 100,
            render: (price: number | undefined) => <Tag color={type === "Product" ? "blue" : "purple"}>{formatPrice(price)}</Tag>,
        },
        {
            title: "MRP",
            dataIndex: "mrp",
            key: "mrp",
            width: 90,
            render: (mrp: number | undefined) => <span className="text-xs text-slate-600">{formatPrice(mrp)}</span>,
        },
        {
            title: "Brand",
            dataIndex: "brand",
            key: "brand",
            width: 130,
            render: (brand: string | undefined) => <span className="text-xs text-slate-600">{brand || "—"}</span>,
        },
        ...(type === "Product"
            ? [
                {
                    title: "Inventory",
                    key: "inventory",
                    width: 220,
                    render: (_: unknown, item: ProductOrService) => (
                        <span className="text-xs text-slate-600">
                            Stock: {item.stockQuantity ?? "—"} • Qty: {item.quantity ?? "—"} {item.quantityUnit || ""}
                        </span>
                    ),
                },
                {
                    title: "Product details",
                    key: "productDetails",
                    width: 230,
                    render: (_: unknown, item: ProductOrService) => (
                        <span className="text-xs text-slate-600">
                            {[item.variant && `Variant: ${item.variant}`, item.productCondition, item.deliveryTime && `Delivery: ${item.deliveryTime}`].filter(Boolean).join(" • ") || "—"}
                        </span>
                    ),
                },
                {
                    title: "Returns / Warranty",
                    key: "policies",
                    width: 210,
                    render: (_: unknown, item: ProductOrService) => (
                        <span className="text-xs text-slate-600">
                            {item.returnAvailable ? `Return: ${item.returnDays ?? "yes"} days` : "No return"} • {item.warrantyAvailable ? `Warranty: ${item.warrantyPeriod || "yes"}` : "No warranty"}
                        </span>
                    ),
                },
            ]
            : [
                {
                    title: "Service details",
                    key: "serviceDetails",
                    width: 300,
                    render: (_: unknown, item: ProductOrService) => (
                        <span className="text-xs text-slate-600">
                            {[item.serviceMode && `Mode: ${item.serviceMode}`, item.serviceLocation, item.serviceDuration && `Duration: ${item.serviceDuration}`, item.bookingRequired !== null && item.bookingRequired !== undefined && `Booking: ${item.bookingRequired ? "Required" : "No"}`].filter(Boolean).join(" • ") || "—"}
                        </span>
                    ),
                },
                {
                    title: "Provider / Business",
                    key: "provider",
                    width: 220,
                    render: (_: unknown, item: ProductOrService) => (
                        <span className="text-xs text-slate-600">
                            {[item.providerName, item.businessName].filter(Boolean).join(" • ") || "—"}
                        </span>
                    ),
                },
            ]),
    ];

    return (
        <Table<ProductOrService>
            rowKey="id"
            columns={columns}
            dataSource={items}
            size="small"
            bordered
            pagination={false}
            scroll={{ x: type === "Product" ? 1390 : 1390 }}
            locale={{ emptyText: `No ${type.toLowerCase()}s` }}
        />
    );
};

const CompanyProductServiceList: React.FC = () => {
    const [companies, setCompanies] = useState<CompanyListing[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get<CompanyListingResponse>(LIST_ENDPOINT, {
                params: {
                    page,
                    size: PAGE_SIZE,
                    type: "ADDCOMPANYADDPRODUCTANDSERVICE",
                },
            });
            const payload = response.data;
            setCompanies(Array.isArray(payload.data) ? payload.data : []);
            setTotalPages(Math.max(1, payload.totalPages || 1));
            setTotalElements(payload.totalElements || 0);
        } catch (requestError: any) {
            setError(
                requestError?.response?.data?.message ||
                "Unable to load company products and services. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        void fetchCompanies();
    }, [fetchCompanies]);

    const normalizedSearch = search.trim().toLowerCase();
    const visibleCompanies = companies.filter((entry) => {
        if (!normalizedSearch) return true;
        return [
            entry.name,
            entry.email,
            entry.mobileNumber,
            entry.company?.companyName,
            entry.company?.locations,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
    });

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            <main>
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Companies, Products & Services</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Review companies and their published marketplace listings.
                            </p>
                        </div>
                        <Button icon={<ReloadOutlined />} onClick={() => void fetchCompanies()} loading={loading}>
                            Refresh
                        </Button>
                    </div>

                    <Card className="mb-5 !rounded-md !border-slate-200" bodyStyle={{ padding: 16 }}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Input
                                allowClear
                                prefix={<SearchOutlined />}
                                placeholder="Search this page by company or contact"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="sm:max-w-md"
                            />
                            <span className="text-sm text-slate-500">
                                {normalizedSearch
                                    ? `Showing ${visibleCompanies.length} of ${companies.length} companies`
                                    : `${totalElements} total companies`}
                            </span>
                        </div>
                    </Card>

                    {error && (
                        <Alert
                            className="mb-5"
                            type="error"
                            showIcon
                            message={error}
                            action={<Button size="small" onClick={() => void fetchCompanies()}>Try again</Button>}
                        />
                    )}

                    {loading ? (
                        <div className="flex min-h-64 items-center justify-center"><Spin size="large" /></div>
                    ) : visibleCompanies.length === 0 ? (
                        <Card className="!rounded-md"><Empty description="No companies found" /></Card>
                    ) : (
                        <div className="space-y-4">
                            {visibleCompanies.map((entry) => (
                                <Card key={`${entry.company?.id}-${entry.email}`} className="!rounded-md !border-slate-200" bodyStyle={{ padding: 0 }}>
                                    <div className="border-b border-slate-100 p-4 md:p-5">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex min-w-0 gap-3">
                                                {isValidImageUrl(entry.company?.logoUrl) && (
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-sky-50">
                                                        <img
                                                            src={entry.company.logoUrl}
                                                            alt={entry.company?.companyName || ""}
                                                            className="h-11 w-11 rounded-md object-cover"
                                                            onError={(e) => {
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) parent.style.display = "none";
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <h2 className="truncate text-lg font-semibold text-slate-900">{entry.company?.companyName || "Unnamed company"}</h2>
                                                    <Tooltip title={entry.company?.companyDescription || undefined} placement="topLeft">
                                                        <p className="line-clamp-2 text-sm text-slate-600">
                                                            {entry.company?.companyDescription || "No company description"}
                                                        </p>
                                                    </Tooltip>
                                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                                        <span><UserOutlined className="mr-1 text-slate-400" />{entry.name}</span>
                                                        {entry.email && (
                                                            <a
                                                                href={`mailto:${entry.email}`}
                                                                className="inline-flex items-center text-slate-600 transition hover:text-sky-600 hover:underline"
                                                                title="Send email"
                                                            >
                                                                <MailOutlined className="mr-1 text-slate-400" />
                                                                {entry.email}
                                                            </a>
                                                        )}
                                                        {entry.mobileNumber && (
                                                            <a
                                                                href={`tel:${entry.mobileNumber}`}
                                                                className="inline-flex items-center text-slate-600 transition hover:text-sky-600 hover:underline"
                                                                title="Call phone"
                                                            >
                                                                <PhoneOutlined className="mr-1 text-slate-400" />
                                                                {entry.mobileNumber}
                                                            </a>
                                                        )}
                                                        {entry.company?.locations && <span>{entry.company.locations}</span>}
                                                        {entry.company?.gstNumber && (
                                                            <span>GST: <strong className="text-slate-700">{entry.company.gstNumber}</strong></span>
                                                        )}
                                                        {isValidImageUrl(entry.company?.gstDocumentUrl) && (
                                                            <a
                                                                href={entry.company?.gstDocumentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                                                                title="View GST document"
                                                            >
                                                                <FileTextOutlined className="text-slate-500" />
                                                                <span>GST Document</span>
                                                            </a>
                                                        )}
                                                        {isValidImageUrl(entry.company?.websiteUrl) && (
                                                            <a
                                                                href={entry.company?.websiteUrl?.startsWith("http") ? entry.company.websiteUrl : `https://${entry.company?.websiteUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                                                                title="Visit website"
                                                            >
                                                                <GlobalOutlined className="text-slate-500" />
                                                                <span>Website</span>
                                                            </a>
                                                        )}
                                                        {isValidImageUrl(entry.company?.linkedinUrl) && (
                                                            <a
                                                                href={entry.company?.linkedinUrl?.startsWith("http") ? entry.company.linkedinUrl : `https://${entry.company?.linkedinUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50/70 px-2 py-0.5 text-xs font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100/70"
                                                                title="View LinkedIn profile"
                                                            >
                                                                <LinkedinOutlined className="text-blue-600" />
                                                                <span>LinkedIn</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <Tag icon={<AppstoreOutlined />} color="blue">{entry.products?.length || 0} products</Tag>
                                                <Tag icon={<ShopOutlined />} color="purple">{entry.services?.length || 0} services</Tag>
                                            </div>
                                        </div>
                                    </div>

                                    {(entry.products?.length > 0 || entry.services?.length > 0) && (
                                        <div className="grid gap-4 p-4 md:grid-cols-2 md:p-5">
                                            <div className="rounded-md border border-slate-200 bg-white p-3">
                                                <h3 className="mb-3 font-semibold text-slate-800">Products</h3>
                                                <ListingTable items={entry.products || []} type="Product" />
                                            </div>
                                            <div className="rounded-md border border-slate-200 bg-white p-3">
                                                <h3 className="mb-3 font-semibold text-slate-800">Services</h3>
                                                <ListingTable items={entry.services || []} type="Service" />
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <Button disabled={page === 0 || loading} onClick={() => setPage((current) => current - 1)}>Previous</Button>
                            <span className="text-sm text-slate-600">Page {page + 1} of {totalPages}</span>
                            <Button disabled={page >= totalPages - 1 || loading} onClick={() => setPage((current) => current + 1)}>Next</Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompanyProductServiceList;
