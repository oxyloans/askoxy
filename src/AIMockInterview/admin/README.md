# ChatKit Interview Admin Dashboard

A modern, responsive admin dashboard for managing interview candidates and viewing their performance.

## Features

✅ **Candidates List Page** (`/admin/candidates`)
- Sortable table with candidate information
- Search by name or skills
- Sort by score, date, or name
- Click rows to view detailed information
- Responsive design for mobile and desktop

✅ **Candidate Detail Page** (`/admin/candidate/:userId`)
- Comprehensive candidate profile
- Resume download functionality
- Score cards with color-coded performance indicators
- Expandable interview results by round
- Question-by-question breakdown with feedback

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lazy loading** for optimal performance

## File Structure

```
src/AIMockInterview/admin/
├── types.ts              # TypeScript interfaces
├── api.ts                # API service layer
├── components.tsx        # Reusable UI components
├── CandidatesList.tsx    # Candidates list page
└── CandidateDetail.tsx   # Candidate detail page
```

## API Integration

### Base URL
```typescript
const API_BASE = 'http://localhost:3001/api/admin';
```

### Endpoints
- `GET /candidates` - Fetch all candidates
- `GET /candidate/:userId` - Fetch specific candidate details

## Components

### Reusable Components

1. **SkillBadge** - Displays skill tags with blue styling
2. **ScoreCard** - Shows scores with color-coded backgrounds
   - Green (8-10): Excellent
   - Yellow (5-7): Good
   - Red (0-4): Needs improvement
3. **LoadingSpinner** - Animated loading state
4. **EmptyState** - Friendly message when no data
5. **ErrorState** - Error handling with retry option

## Routes

Add these routes to your App.tsx:

```typescript
<Route path="/admin/candidates" element={<CandidatesList />} />
<Route path="/admin/candidate/:userId" element={<CandidateDetail />} />
```

## Usage

### Navigate to Candidates List
```
http://localhost:3000/admin/candidates
```

### View Candidate Details
Click any row in the candidates table or navigate to:
```
http://localhost:3000/admin/candidate/{userId}
```

## Features in Detail

### Search & Filter
- Real-time search across candidate names and skills
- Case-insensitive matching
- Instant results

### Sorting
- Sort by Date (default, descending)
- Sort by Score (highest first)
- Sort by Name (alphabetical)
- Toggle ascending/descending order

### Score Visualization
- Color-coded scores for quick assessment
- Progress indicators showing round completion
- Average scores calculated automatically

### Interview Results
- Accordion-style expandable sections per round
- Question and answer display
- Individual question scores
- Detailed feedback for each response

### Responsive Design
- Mobile-friendly table layout
- Adaptive grid for score cards
- Touch-friendly accordion controls
- Optimized for all screen sizes

## Customization

### Change API Base URL
Edit `src/AIMockInterview/admin/api.ts`:
```typescript
const API_BASE = 'https://your-api-domain.com/api/admin';
```

### Modify Score Thresholds
Edit the color logic in components:
```typescript
const scoreNum = parseFloat(score);
if (scoreNum >= 8) return 'green';  // Change threshold
if (scoreNum >= 5) return 'yellow'; // Change threshold
return 'red';
```

### Customize Styling
All components use Tailwind CSS classes. Modify classes directly in component files.

## Error Handling

- Network errors display user-friendly messages
- Retry functionality on failed requests
- Loading states during data fetching
- Empty states when no data available

## Performance Optimizations

- Lazy loading of components
- Memoized filtering and sorting
- Efficient re-renders with React hooks
- Minimal API calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Export candidates to CSV/Excel
- Bulk actions (delete, email)
- Advanced filtering (by experience, score range)
- Pagination for large datasets
- Real-time updates with WebSocket
- Interview scheduling integration
- Email notifications
- PDF report generation

## Troubleshooting

### API Connection Issues
Ensure the backend server is running on `http://localhost:3001`

### CORS Errors
Configure CORS on your backend to allow requests from your frontend domain

### Styling Issues
Ensure Tailwind CSS is properly configured in your project

## License

This component is part of the AskOxy project.
