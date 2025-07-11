"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Trash2,
  CheckCircle,

} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  LineChart,
} from "recharts";

// Assuming you have this type defined in '@/types/globals'
import { EventWithDetails } from "@/features/events/types/event";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = {
  hover: { y: -5, transition: { duration: 0.2 } },
};

export default function AdminDashboard() {
  const { user } = useUser();
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint for fetching all events
      const response = await axios.get("/api/events");
      setEvents(response.data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  const handleEventActionSuccess = () => {
    fetchEvents(); // Refetch events after an action
  };

  const activeEvents = events.filter((e) => e.status === "approved").length;
  const pendingEvents = events.filter((e) => e.status === "pending").length;
  const totalRegistrations = events.reduce(
    (sum, event) =>
      sum +
      event.ticketTypes.reduce((tSum, ticket) => tSum + (ticket.sold || 0), 0),
    0
  );
  const totalEarnings = events.reduce(
    (sum, event) =>
      sum +
      event.ticketTypes.reduce(
        (tSum, ticket) => tSum + (ticket.sold || 0) * ticket.price,
        0
      ),
    0
  );

  const summaryCards = [
    {
      title: "Active Events",
      value: activeEvents,
      icon: "🎯",
    },
    {
      title: "Pending Approvals",
      value: pendingEvents,
      icon: "⏳",
    },
    {
      title: "Total Registrations",
      value: totalRegistrations,
      icon: "🎟️",
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: "💰",
    },
  ];

  // Data for charts
  const statusDistributionData = [
    { name: "Active", value: activeEvents },
    { name: "Pending", value: pendingEvents },
  ];

  const categoryDistributionData = events.reduce((acc, event) => {
    acc[event.location.type] = (acc[event.location.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryDistributionData).map(
    ([name, value]) => ({ name, value })
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF19A3",
  ];

  if (error)
    return (
      <div className="text-red-500 p-4">
        Error loading events: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all events and system performance
          </p>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {summaryCards.map((card, index) => (
          <motion.div key={index} variants={fadeIn} whileHover="hover">
            <motion.div variants={cardHover}>
              <SummaryCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                index={index}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <Card className="rounded-xl shadow-sm border p-4">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Event Location Types</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryChartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent=1 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {categoryChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} events`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
        <Card className="rounded-xl shadow-sm border p-4">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Ticket Sales Breakdown</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={events.flatMap(event => 
          event.ticketTypes.map(ticket => ({
            event: event.title,
            type: ticket.name,
            sales: ticket.sold,
            revenue: ticket.sold * ticket.price
          })))
        }
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="event" angle={-45} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => 
            name === 'sales' ? [value, 'Tickets Sold'] : [`₹${value}`, 'Revenue']
          }
        />
        <Legend />
        <Bar dataKey="sales" name="Tickets Sold" stackId="a" fill="#82ca9d" />
        <Bar dataKey="revenue" name="Revenue" stackId="a" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
        <Card className="rounded-xl shadow-sm border p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { month: "Jan", earnings: 4000 },
                  { month: "Feb", earnings: 3000 },
                  { month: "Mar", earnings: 5000 },
                  { month: "Apr", earnings: 2780 },
                  { month: "May", earnings: 1890 },
                  { month: "Jun", earnings: 2390 },
                  { month: "Jul", earnings: totalEarnings },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Earnings"]} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Event Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent = 10 }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Events</h2>
          <div className="text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "event" : "events"} total
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <AdminEventsTable
            events={events}
            onEventAction={handleEventActionSuccess}
            isLoading={isLoading}
          />
        )}
      </motion.div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  index,
}: {
  title: string;
  value: string | number;
  icon: string;
  index: number;
}) {
  const colors = ["bg-blue-50", "bg-orange-50", "bg-green-50", "bg-purple-50"];
  const accents = [
    "text-[#468FAF]",
    "text-[#FF6B6B]",
    "text-green-600",
    "text-purple-600",
  ];

  return (
    <Card className={`${colors[index]} border-0 rounded-xl h-full`}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className={`text-sm font-medium ${accents[index]}`}>
          {title}
        </CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function AdminEventsTable({
  events,
  onEventAction,
  isLoading,
}: {
  events: EventWithDetails[];
  onEventAction: () => void;
  isLoading: boolean;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCheapestTicketPrice = (ticketTypes: { price: number }[]) => {
    if (!ticketTypes.length) return 0;
    return Math.min(...ticketTypes.map((t) => t.price));
  };

  const getTotalTicketsSold = (ticketTypes: { sold?: number }[]) => {
    return ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0);
  };

  const handleDeleteEvent = async (eventId: string | object) => {
    const id = typeof eventId === "string" ? eventId : eventId.toString();
    try {
      // Replace with your actual API endpoint for deleting an event
      await axios.delete(`/api/events/${id}`);
      onEventAction(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleApproveEvent = async (eventId: string | object) => {
    const id = typeof eventId === "string" ? eventId : eventId.toString();
    try {
      // Replace with your actual API endpoint for approving an event
      await axios.put(`/api/events/${id}/approve`);
      onEventAction(); // Refresh data after approval
    } catch (error) {
      console.error("Error approving event:", error);
      alert("Failed to approve event. Please try again.");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Tickets Sold</TableHead>
          <TableHead>Price From</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow
            key={
              typeof event._id === "string" ? event._id : event._id.toString()
            }
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <div>{event.title}</div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(event.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[200px] overflow-hidden whitespace-nowrap text-sm text-muted-foreground">
                  {event.location.address}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-muted-foreground" />
                <span>{getTotalTicketsSold(event.ticketTypes)}</span>
              </div>
            </TableCell>
            <TableCell>
              ₹{getCheapestTicketPrice(event.ticketTypes).toLocaleString()}
              {event.ticketTypes.length > 1 && "+"}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              {event.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApproveEvent(event._id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the event and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/events/${event.slug}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {events.length === 0 && !isLoading && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center py-8 text-muted-foreground"
            >
              No events found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
