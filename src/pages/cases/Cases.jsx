import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useChat } from '../../context/ChatContext';
import { AIChatbotModal } from '../../components/AIChatBotModal';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import UserMenu from '../../components/layout/UserMenu';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';

import {
  Search,
  Plus,
  Eye,
  MessageSquare,
  Gavel,
  Pencil,
  Trash2,
  Calendar,
  Users,
} from 'lucide-react';

const PAGE_SIZE = 20;
const DEBOUNCE_DELAY = 300;

const Cases = () => {
  const navigate = useNavigate();
  const { openChat } = useChat();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [selectedChatCaseId, setSelectedChatCaseId] = useState(null);
  const [selectedChatCaseName, setSelectedChatCaseName] = useState('');

  const FALLBACK = '—';

  const parseParties = (parties) => {
    if (!parties) return { plaintiff: FALLBACK, defendant: FALLBACK };
    const [plaintiff, defendant] = parties.split(' vs ');
    return {
      plaintiff: plaintiff || FALLBACK,
      defendant: defendant || FALLBACK,
    };
  };

  const calculatePriorityFromDate = (nextCourtDate) => {
    if (!nextCourtDate) return 'low';

    const today = new Date();
    const courtDate = new Date(nextCourtDate);
    const diffDays = Math.ceil((courtDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 5) return 'high';
    if (diffDays <= 10) return 'medium';
    return 'low';
  };

  // -----------------------------
  // Fetch cases
  // -----------------------------
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const skip = (page - 1) * PAGE_SIZE;

      const { data } = await api.get('/api/v1/cases/list-cases', {
        params: {
          skip,
          limit: PAGE_SIZE,
          case_name: search || undefined,
        },
      });

      setCases(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong while fetching cases'
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // -----------------------------
  // Debounce search
  // -----------------------------
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(t);
  }, [searchInput]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Helper styling functions (match first file)
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'closed':
        return 'bg-slate-500/10 text-slate-700 border-slate-500/30';
      case 'archived':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
      case 'medium':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/30';
      case 'low':
        return 'bg-teal-500/10 text-teal-700 border-teal-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/30';
    }
  };

  // derived counts (safe if fields aren't there yet)
  const activeCount = cases.filter((c) => c.status === 'active').length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'>
      {/* Header */}
      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200/60 shadow-sm'>
        <div className='max-w-7xl mx-auto px-8 py-8'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-5'>
              <div className='bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg shadow-blue-600/20'>
                <Gavel className='w-7 h-7 text-white' />
              </div>
              <div>
                <h1 className='text-3xl text-slate-900 mb-2'>
                  Case Management
                </h1>
                <p className='text-slate-600 text-lg'>
                  Manage and track all your legal cases
                </p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <Button
                onClick={() => navigate('/cases/create')}
                size='default'
                className='shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create New Case
              </Button>

              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-8 py-8'>
        <Card className='shadow-lg border-slate-200/60'>
          {/* Search and Stats */}
          <div className='p-8 border-b border-slate-200/60'>
            <div className='flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400' />
                <Input
                  placeholder='Search by case ID or title...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className='pl-12 pr-4 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm'
                />
              </div>
              <div className='flex gap-4'>
                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4 rounded-xl border border-blue-200/60 shadow-sm'>
                  <p className='text-sm text-slate-600 mb-1'>Total Cases</p>
                  <p className='text-2xl text-slate-900'>{total}</p>
                </div>
                <div className='bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-4 rounded-xl border border-emerald-200/60 shadow-sm'>
                  <p className='text-sm text-slate-600 mb-1'>Active Cases</p>
                  <p className='text-2xl text-slate-900'>{total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cases Table */}
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-slate-50/50 hover:bg-slate-50/50'>
                  <TableHead className='text-slate-700'>Case ID</TableHead>
                  <TableHead className='text-slate-700'>Case Title</TableHead>
                  <TableHead className='text-slate-700'>Parties</TableHead>
                  <TableHead className='text-slate-700'>Status</TableHead>
                  <TableHead className='text-slate-700'>Priority</TableHead>
                  <TableHead className='text-slate-700'>Next Date</TableHead>
                  <TableHead className='text-slate-700'>Attorney</TableHead>
                  <TableHead className='text-right text-slate-700'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='text-center py-12 text-slate-500'
                    >
                      Loading cases…
                    </TableCell>
                  </TableRow>
                )}

                {!loading && cases.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='text-center py-12 text-slate-500'
                    >
                      No cases found
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  cases.map((c) => {
                    const meta = c.case_metadata || {};
                    const { plaintiff, defendant } = parseParties(meta.parties);
                    const priority = calculatePriorityFromDate(
                      meta.next_court_date
                    );

                    return (
                      <TableRow
                        key={c.id}
                        className='hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-colors'
                      >
                        {/* CASE ID */}
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <div className='bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg shadow-sm'>
                              <Gavel className='w-3.5 h-3.5 text-white' />
                            </div>
                            <span className='text-slate-900 font-medium'>
                              {c.case_no || FALLBACK}
                            </span>
                          </div>
                        </TableCell>

                        {/* CASE TITLE */}
                        <TableCell>
                          <span className='text-slate-900'>
                            {c.case_name || FALLBACK}
                          </span>
                        </TableCell>

                        {/* PARTIES */}
                        <TableCell>
                          <div className='flex items-start gap-2'>
                            <Users className='w-4 h-4 text-slate-400 mt-0.5' />
                            <div className='text-sm'>
                              <p className='text-slate-900'>{plaintiff}</p>
                              <p className='text-slate-500 text-xs'>vs.</p>
                              <p className='text-slate-900'>{defendant}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* STATUS (fallback to active if not provided) */}
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={getStatusColor(c.status || 'active')}
                          >
                            {c.status || 'active'}
                          </Badge>
                        </TableCell>

                        {/* PRIORITY (calculated) */}
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={getPriorityColor(priority)}
                          >
                            {priority}
                          </Badge>
                        </TableCell>

                        {/* NEXT COURT DATE */}
                        <TableCell>
                          <div className='flex items-center gap-2 text-slate-600'>
                            <Calendar className='w-4 h-4' />
                            <span className='text-sm'>
                              {meta.next_court_date
                                ? new Date(
                                    meta.next_court_date
                                  ).toLocaleDateString()
                                : FALLBACK}
                            </span>
                          </div>
                        </TableCell>

                        {/* ATTORNEY */}
                        <TableCell className='text-slate-600'>
                          {meta.attorney || FALLBACK}
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => navigate(`/cases/${c.id}`)}
                              className='hover:bg-blue-50 group'
                              title='View Case Details'
                            >
                              <Eye className='w-4 h-4 text-slate-600 group-hover:text-blue-600' />
                            </Button>

                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                setSelectedChatCaseId(c.id);
                                setSelectedChatCaseName(c.case_name || 'Case');
                                setChatbotOpen(true);
                              }}
                              className='hover:bg-purple-50 group'
                              title='AI Chatbot'
                            >
                              <MessageSquare className='w-4 h-4 text-slate-600 group-hover:text-purple-600' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className='p-6 border-t border-slate-200/60 bg-slate-50/30'>
            <div className='flex items-center justify-between text-sm text-slate-600'>
              <p>
                Showing <span className='font-medium'>{cases.length}</span> of{' '}
                <span className='font-medium'>{total}</span> cases
              </p>
              <p className='text-xs'>
                Each case has an AI-powered chatbot to assist with case-related
                questions
              </p>
            </div>
          </div>

          <AIChatbotModal
            isOpen={chatbotOpen}
            onClose={() => setChatbotOpen(false)}
            caseId={selectedChatCaseId}
            caseName={selectedChatCaseName}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='p-4 flex justify-end gap-3 items-center text-sm'>
              <Button
                size='sm'
                variant='outline'
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>

              <span>
                Page {page} of {totalPages}
              </span>

              <Button
                size='sm'
                variant='outline'
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Cases;
