import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    Clock3,
    ListTodo,
    PauseCircle,
    Sparkles,
    XCircle,
} from "lucide-react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
import { employeeApi } from "../utils/axiosInstances";

interface TaskStatusCounts {
    assignedCount: number;
    acceptCount: number;
    holdCount: number;
    rejectCount: number;
    completedCount: number;
    totalCount: number;
}

interface RecentTask {
    taskAssignBy?: string | null;
    taskAssignTo?: Array<string | null> | null;
    taskName?: string | null;
    status?: string | null;
    id?: string | null;
    tastCreatedDate?: string | null;
    taskAssignedDate?: string | null;
    taskCompleteDate?: string | null;
    image?: string | null;
}

const initialCounts: TaskStatusCounts = {
    assignedCount: 0,
    acceptCount: 0,
    holdCount: 0,
    rejectCount: 0,
    completedCount: 0,
    totalCount: 0,
};

const statusCards = [
    {
        key: "assignedCount",
        label: "Assigned",
        helper: "Tasks assigned to you",
        icon: ClipboardList,
        color: "text-blue-700",
        background: "bg-blue-50",
        border: "border-blue-100",
        bar: "bg-blue-500",
    },
    {
        key: "acceptCount",
        label: "Accepted",
        helper: "Tasks you accepted",
        icon: CheckCircle2,
        color: "text-emerald-700",
        background: "bg-emerald-50",
        border: "border-emerald-100",
        bar: "bg-emerald-500",
    },
    {
        key: "holdCount",
        label: "On Hold",
        helper: "Tasks currently on hold",
        icon: PauseCircle,
        color: "text-amber-700",
        background: "bg-amber-50",
        border: "border-amber-100",
        bar: "bg-amber-500",
    },
    {
        key: "rejectCount",
        label: "Rejected",
        helper: "Tasks you rejected",
        icon: XCircle,
        color: "text-rose-700",
        background: "bg-rose-50",
        border: "border-rose-100",
        bar: "bg-rose-500",
    },
    {
        key: "completedCount",
        label: "Completed",
        helper: "Tasks you completed",
        icon: CheckCircle2,
        color: "text-indigo-700",
        background: "bg-indigo-50",
        border: "border-indigo-100",
        bar: "bg-indigo-500",
    },
    {
        key: "totalCount",
        label: "Total Tasks",
        helper: "All tasks in summary",
        icon: ListTodo,
        color: "text-indigo-700",
        background: "bg-indigo-50",
        border: "border-indigo-100",
        bar: "bg-indigo-500",
    },
] as const;

const statusBadgeClasses: Record<string, string> = {
    ASSIGNED: "border-blue-200 bg-blue-50 text-blue-700",
    ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    ACCEPT: "border-emerald-200 bg-emerald-50 text-emerald-700",
    HOLD: "border-amber-200 bg-amber-50 text-amber-700",
    ON_HOLD: "border-amber-200 bg-amber-50 text-amber-700",
    REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
    REJECT: "border-rose-200 bg-rose-50 text-rose-700",
    COMPLETED: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

const formatStatus = (status?: string | null) => {
    if (!status) return "Unknown";
    return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const extractRecentTasks = (payload: unknown): RecentTask[] | null => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return null;

    const responseBody = payload as Record<string, unknown>;
    for (const key of ["data", "tasks", "content", "result", "items"]) {
        const taskList = extractRecentTasks(responseBody[key]);
        if (taskList) return taskList;
    }

    return null;
};

const sortTasksByCreatedDate = (tasks: RecentTask[]) =>
    [...tasks].sort((firstTask, secondTask) => {
        const getDateValue = (date?: string | null) => {
            if (!date) return 0;
            const [day, month, year] = date.split("/").map(Number);
            if (!day || !month || !year) return 0;
            return new Date(year, month - 1, day).getTime();
        };

        return getDateValue(secondTask.tastCreatedDate) - getDateValue(firstTask.tastCreatedDate);
    });

const TaskDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState<TaskStatusCounts>(initialCounts);
    const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [recentLoading, setRecentLoading] = useState(true);
    const [error, setError] = useState(false);
    const [recentError, setRecentError] = useState(false);
    const userName = sessionStorage.getItem("Name") || "User";

    const fetchDashboard = async () => {
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            setLoading(false);
            setRecentLoading(false);
            setError(true);
            setRecentError(true);
            return;
        }

        setLoading(true);
        setRecentLoading(true);
        setError(false);
        setRecentError(false);

        const [countsResult, tasksResult] = await Promise.allSettled([
            employeeApi.get<TaskStatusCounts>(
                `${BASE_URL}/ai-service/agent/taskStatusCounts`,
                {
                    params: { userId },
                },
            ),
            employeeApi.get<unknown>(
                `${BASE_URL}/ai-service/agent/showingTaskBasedOnUserId`,
                {
                    params: { userId },
                },
            ),
        ]);

        if (countsResult.status === "fulfilled") {
            setCounts({ ...initialCounts, ...countsResult.value.data });
        } else {
            console.error("Error fetching task status counts:", countsResult.reason);
            setError(true);
        }

        if (tasksResult.status === "fulfilled") {
            const taskList = extractRecentTasks(tasksResult.value.data);
            if (taskList) {
                setRecentTasks(sortTasksByCreatedDate(taskList));
            } else {
                console.error("Recent Tasks API returned an unexpected response:", tasksResult.value.data);
                setRecentTasks([]);
                setRecentError(true);
            }
        } else {
            console.error("Error fetching recent tasks:", tasksResult.reason);
            setRecentError(true);
        }

        setLoading(false);
        setRecentLoading(false);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const completionRate = useMemo(() => {
        if (!counts.totalCount) return 0;
        return Math.round((counts.completedCount / counts.totalCount) * 100);
    }, [counts.completedCount, counts.totalCount]);

    const assignedRate = useMemo(() => {
        if (!counts.totalCount) return 0;
        return Math.round((counts.assignedCount / counts.totalCount) * 100);
    }, [counts.assignedCount, counts.totalCount]);

    const pendingCount = Math.max(counts.totalCount - counts.completedCount, 0);
    const visibleRecentTasks = recentTasks.slice(0, 3);

    return (
        <UserPanelLayout>
            <main className="-m-3 min-w-0 min-h-[calc(100vh-150px)] bg-white p-3 sm:-m-6 sm:p-5 lg:p-6 xl:p-8">
                <div className="mx-auto min-w-0 max-w-7xl">
                    <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[32px]">
                                Welcome back, {userName}! <span aria-hidden="true">👋</span>
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
                                Here&apos;s what&apos;s happening with your tasks today.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/planoftheday")}
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-purple-700 bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-purple-800 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-teal-200"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Add Plan of the Day
                        </button>
                    </header>

                    <section
                        className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
                        aria-label="Task status summary"
                    >
                        {statusCards.map(
                            ({
                                key,
                                label,
                                helper,
                                icon: Icon,
                                color,
                                background,
                                border,
                                bar,
                            }) => {
                                const value = counts[key];
                                const percent = counts.totalCount
                                    ? Math.min(100, Math.round((value / counts.totalCount) * 100))
                                    : 0;

                                return (
                                    <article
                                        key={key}
                                        className={`group rounded-2xl border ${border} bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(15,23,42,0.08)] sm:p-5`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${background} ${color}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-2xl font-bold leading-none text-slate-950">
                                                    {loading ? "-" : value}
                                                </p>
                                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                                    {label}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-4 min-h-10 text-xs leading-5 text-slate-500">
                                            {helper}
                                        </p>
                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-full rounded-full ${bar}`}
                                                style={{ width: `${loading ? 0 : percent}%` }}
                                            />
                                        </div>
                                    </article>
                                );
                            },
                        )}
                    </section>

                    <section className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,0.7fr)]">
                        <article className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold text-slate-950">
                                    Task Overview
                                </h2>
                                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                                    Live summary
                                </span>
                            </div>

                            <div className="flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
                                <div className="relative h-44 w-44 shrink-0">
                                    <div
                                        className="h-full w-full rounded-full"
                                        style={{
                                            background: `conic-gradient(#3b82f6 0 ${assignedRate}%, #8b5cf6 ${assignedRate}% ${Math.min(100, assignedRate + completionRate)}%, #eef2f7 ${Math.min(100, assignedRate + completionRate)}% 100%)`,
                                        }}
                                    />
                                    <div className="absolute inset-[20px] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
                                        <strong className="text-3xl font-bold text-slate-950">
                                            {loading ? "-" : counts.totalCount}
                                        </strong>
                                        <span className="mt-1 text-sm text-slate-500">
                                            Total Tasks
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    {statusCards.slice(0, 5).map(({ key, label, bar }) => {
                                        const value = counts[key];
                                        const percent = counts.totalCount
                                            ? Math.round((value / counts.totalCount) * 100)
                                            : 0;
                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span className={`h-2.5 w-2.5 rounded-full ${bar}`} />
                                                <span className="min-w-0 flex-1 font-medium text-slate-700">
                                                    {label}
                                                </span>
                                                <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500 sm:text-sm">
                                                    {loading ? "-" : `${value} (${percent}%)`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 p-4">
                                <div className="flex gap-3">
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            You&apos;ve completed {completionRate}% of your tasks.
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Keep up the momentum and stay on track.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950">
                                        Recent Tasks
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Your latest assigned task activity
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-blue-600">
                                    Showing {visibleRecentTasks.length} of {recentTasks.length}{" "}
                                    tasks
                                </span>
                            </div>

                            <div className="min-w-0">
                                {recentLoading ? (
                                    <div className="space-y-3 p-5 sm:p-6">
                                        {[1, 2, 3].map((item) => (
                                            <div
                                                key={item}
                                                className="h-16 animate-pulse rounded-xl bg-slate-100"
                                            />
                                        ))}
                                    </div>
                                ) : recentError ? (
                                    <div className="flex h-full min-h-72 flex-col items-center justify-center p-8 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                                            <XCircle className="h-6 w-6" />
                                        </div>
                                        <p className="mt-4 font-semibold text-slate-900">
                                            Unable to load recent tasks
                                        </p>
                                        <button
                                            onClick={fetchDashboard}
                                            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : visibleRecentTasks.length === 0 ? (
                                    <div className="flex h-full min-h-72 flex-col items-center justify-center p-8 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <ClipboardList className="h-7 w-7" />
                                        </div>
                                        <p className="mt-4 font-semibold text-slate-900">
                                            No recent tasks
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            New tasks will appear here when they are assigned.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [-webkit-overflow-scrolling:touch] md:overflow-x-visible">
                                        <table className="w-full min-w-[680px] table-fixed text-left md:min-w-0">
                                            <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                <tr>
                                                    <th className="w-[52%] whitespace-nowrap px-4 py-3 sm:px-6">Task</th>
                                                    <th className="w-[20%] whitespace-nowrap px-4 py-3">Status</th>
                                                    <th className="w-[28%] whitespace-nowrap px-4 py-3 sm:px-6">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {visibleRecentTasks.map((task, index) => {
                                                    const statusKey = (task.status || "").toUpperCase();
                                                    return (
                                                        <tr
                                                            key={task.id || index}
                                                            className="transition hover:bg-blue-50/30"
                                                        >
                                                            <td className="px-4 py-4 sm:px-6">
                                                                <div className="min-w-0">
                                                                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                                                                        {task.taskName}
                                                                    </p>
                                                                    {task.id && (
                                                                        <p className="mt-1 truncate text-[11px] text-slate-400">
                                                                            ID: {task.id.slice(-4)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <span
                                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[statusKey] || "border-slate-200 bg-slate-50 text-slate-600"}`}
                                                                >
                                                                    {formatStatus(task.status)}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 sm:px-6">
                                                                {/* <p className="text-sm font-medium text-slate-700">
                                                                {task.taskAssignedDate || "—"}
                                                            </p> */}
                                                                {task.tastCreatedDate && (
                                                                    <p className="mt-1 text-xs text-slate-400">
                                                                        {task.tastCreatedDate}
                                                                    </p>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-100 p-4 sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/taskmanagement/assignedtasks")}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                    View all tasks <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </article>

                        <aside className="h-full min-w-0 space-y-5">
                            <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <h2 className="text-base font-bold text-slate-950">
                                    Status Distribution
                                </h2>
                                <div className="mt-5 space-y-4">
                                    {statusCards
                                        .slice(0, 5)
                                        .map(
                                            ({ key, label, icon: Icon, color, background, bar }) => {
                                                const value = counts[key];
                                                const percent = counts.totalCount
                                                    ? Math.round((value / counts.totalCount) * 100)
                                                    : 0;
                                                return (
                                                    <div key={key}>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <span
                                                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${background} ${color}`}
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                            </span>
                                                            <span className="flex-1 text-sm font-semibold text-slate-700">
                                                                {label}
                                                            </span>
                                                            <span className="text-xs font-semibold text-slate-500">
                                                                {loading ? "-" : `${value} (${percent}%)`}
                                                            </span>
                                                        </div>
                                                        <div className="ml-10 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className={`h-full rounded-full ${bar}`}
                                                                style={{ width: `${loading ? 0 : percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                </div>
                            </article>

                            {/* <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                                <h2 className="text-base font-bold text-slate-950">
                                    Quick Actions
                                </h2>
                                <div className="mt-4 space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/planoftheday")}
                                        className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:border-blue-100 hover:bg-blue-50"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                            <ClipboardList className="h-4 w-4" />
                                        </span>
                                        <span className="flex-1">
                                            <span className="block text-sm font-semibold text-slate-800">
                                                My Tasks
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                Review assigned work
                                            </span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={fetchDashboard}
                                        className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:border-emerald-100 hover:bg-emerald-50"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                            <RefreshCw className="h-4 w-4" />
                                        </span>
                                        <span className="flex-1">
                                            <span className="block text-sm font-semibold text-slate-800">
                                                Refresh Dashboard
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                Load latest activity
                                            </span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                                    </button>
                                </div>
                            </article> */}
                        </aside>
                    </section>

                    {/* <section className="mt-5 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                                    <Clock3 className="h-7 w-7" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950">
                                        Plan your day better!
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        You have{" "}
                                        <strong className="text-slate-900">
                                            {loading ? "—" : pendingCount} tasks pending
                                        </strong>
                                        . Prioritize your work and stay on track.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/planoftheday")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/50 transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Go to My Tasks <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </section> */}

                    {error && (
                        <p className="mt-4 text-center text-sm font-medium text-rose-600">
                            Some task-summary data could not be loaded. Use Refresh to try
                            again.
                        </p>
                    )}
                </div>
            </main>
        </UserPanelLayout>
    );
};

export default TaskDashboard;
