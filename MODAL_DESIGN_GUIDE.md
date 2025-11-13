# Modal Form - Visual Appearance

## Desktop View

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                              ✕        │ │
│  │  Quick Quote Request                                 │ │
│  │  Please provide your details to generate quotation   │ │
│  │                                                      │ │
│  │  ┌─────────────────────────────────────────────────┐ │
│  │  │ Full Name *                                     │ │
│  │  │ ┌─────────────────────────────────────────────┐ │ │
│  │  │ │ John Doe                                  ▼ │ │ │
│  │  │ └─────────────────────────────────────────────┘ │ │
│  │  │                                                 │ │
│  │  │ Email *                                         │ │
│  │  │ ┌─────────────────────────────────────────────┐ │ │
│  │  │ │ john@example.com                         ▼ │ │ │
│  │  │ └─────────────────────────────────────────────┘ │ │
│  │  │                                                 │ │
│  │  │ Company (Optional)                              │ │
│  │  │ ┌─────────────────────────────────────────────┐ │ │
│  │  │ │ Tech Startup Inc                        ▼ │ │ │
│  │  │ └─────────────────────────────────────────────┘ │ │
│  │  │                                                 │ │
│  │  │ Phone (Optional)                                │ │
│  │  │ ┌─────────────────────────────────────────────┐ │ │
│  │  │ │ +91 9876543210                         ▼ │ │ │
│  │  │ └─────────────────────────────────────────────┘ │ │
│  │  │                                                 │ │
│  │  │  ┌────────────────┐  ┌────────────────────────┐ │
│  │  │  │    Cancel      │  │   Generate Quote       │ │
│  │  │  └────────────────┘  └────────────────────────┘ │
│  │  │                                                 │ │
│  │  └─────────────────────────────────────────────────┘ │
│  │                                                      │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│            Background blur/overlay at 50% opacity          │
└─────────────────────────────────────────────────────────────┘
```

## Mobile View

```
┌─────────────────────────────┐
│                             │
│  ┌─────────────────────────┐│
│  │                  ✕      ││
│  │ Quick Quote Request     ││
│  │ Please provide details  ││
│  │                         ││
│  │ Full Name *             ││
│  │ ┌─────────────────────┐││
│  │ │John Doe          ▼ │││
│  │ └─────────────────────┘││
│  │                         ││
│  │ Email *                 ││
│  │ ┌─────────────────────┐││
│  │ │john@example     ▼ │││
│  │ └─────────────────────┘││
│  │                         ││
│  │ Company (Optional)      ││
│  │ ┌─────────────────────┐││
│  │ │Tech Startup      ▼ │││
│  │ └─────────────────────┘││
│  │                         ││
│  │ Phone (Optional)        ││
│  │ ┌─────────────────────┐││
│  │ │+91 9876543210   ▼ │││
│  │ └─────────────────────┘││
│  │                         ││
│  │ ┌──────────┐┌──────────┐│
│  │ │ Cancel   ││Generate  ││
│  │ └──────────┘└──────────┘│
│  │                         ││
│  └─────────────────────────┘│
│                             │
│      50% backdrop overlay   │
└─────────────────────────────┘
```

## Color Scheme

### Modal Background
- Gradient: `from-slate-800 to-slate-900`
- Border: `border-slate-700`
- Shadow: `shadow-2xl`

### Form Fields
- Background: `bg-slate-700/50`
- Border: `border-slate-600`
- Text: `text-white`
- Placeholder: `placeholder-gray-500`
- Focus Ring: `focus:border-blue-500 focus:ring-blue-500`

### Labels
- Color: `text-gray-300`
- Size: `text-sm`
- Weight: `font-medium`

### Buttons

**Cancel Button:**
- Background: `bg-slate-700/50`
- Text: `text-gray-300`
- Hover: `hover:bg-slate-700`

**Generate Quote Button:**
- Background: `bg-gradient-to-r from-blue-500 to-cyan-500`
- Text: `text-white`
- Hover: `hover:from-blue-600 hover:to-cyan-600`
- Font: `font-semibold`

### Text
- Title: `text-2xl font-bold text-white`
- Description: `text-sm text-gray-400`

## Animation

### Opening Modal
```
1. Modal appears with smooth fade-in
   - Backdrop fades to 50% opacity
   - Modal scales up smoothly
   - Duration: 300ms

2. First input field auto-focuses
   - Full Name field gets focus
   - Keyboard ready for input

3. Body scroll disabled
   - Background content can't scroll
   - Focus stays on modal
```

### Closing Modal
```
1. Click Cancel / X button
   - Modal fades out smoothly
   - Backdrop fades away
   - Body scroll restored
   - Duration: 300ms

2. Press Escape key
   - Same smooth fade out
   - Modal closes gracefully

3. Click backdrop/outside
   - Modal closes
   - Same animation
```

### Button States

**Normal State:**
```
┌──────────────────────────┐
│    Generate Quote        │
│  from-blue-500 gradient  │
└──────────────────────────┘
```

**Hover State:**
```
┌──────────────────────────┐
│    Generate Quote        │
│  from-blue-600 gradient  │  (darker)
│      (brightens)         │
└──────────────────────────┘
```

**Loading State:**
```
┌──────────────────────────┐
│  ⏳ Creating Quotation...  │  (disabled)
│      (grayed out)        │
│    (button disabled)     │
└──────────────────────────┘
```

## Focus States

### Focused Input Field
```
┌─────────────────────────────────┐
│ Full Name *                     │
│ ┌───────────────────────────────┐│
│ │ John Doe                   █  ││  ← Text cursor visible
│ └───────────────────────────────┘│  ← Blue focus ring
│   ▲                               │
│   └─ Blue border and glow         │
└─────────────────────────────────┘
```

### Keyboard Navigation

```
TAB Order:
1. Full Name input
   └─ TAB ↓
2. Email input
   └─ TAB ↓
3. Company input
   └─ TAB ↓
4. Phone input
   └─ TAB ↓
5. Cancel button
   └─ TAB ↓
6. Generate Quote button
   └─ TAB ↓
(Wraps back to Full Name)

ESC: Closes modal immediately
ENTER: Submits form (from any input)
```

## Validation Visual Feedback

### Email Validation Error
```
Before submit:
User leaves email empty or invalid

After submit click:
┌──────────────────────────────┐
│ ❌ Please enter a valid      │
│    email address             │
│                              │
│ Modal stays open             │
│ Focus returns to email field │
│ User can correct and retry   │
└──────────────────────────────┘
```

## Accessibility

### ARIA Labels
```html
- Modal: role="dialog" aria-modal="true"
- Fields: <label for="fieldId">Label</label>
- Required: aria-required="true"
- Descriptions: aria-describedby="id"
```

### Keyboard Support
```
✓ Tab navigation through fields
✓ Shift+Tab reverse navigation
✓ Enter to submit form
✓ Escape to close modal
✓ Arrow keys in select dropdowns
```

### Screen Reader
```
"Quick Quote Request dialog
 Please provide your details to generate your quotation
 Form group with 4 input fields
 Full Name required text input
 Email required email input
 Company optional text input
 Phone optional telephone input
 Two buttons: Cancel and Generate Quote"
```

## Responsive Breakpoints

### Mobile (< 768px)
- Full width with 16px margin
- Modal width: 100% - 32px
- Stack layout for buttons
- Touch-friendly button size: 44px+ height

### Tablet (768px - 1024px)
- Modal width: 90% max 500px
- Side-by-side buttons
- Normal font sizes

### Desktop (> 1024px)
- Modal width: 100% max 500px
- Centered on screen
- All normal sizing

## Loading States

### During Submission
```
┌──────────────────────────────┐
│ Full Name *                  │
│ [Disabled - grayed out]      │
│                              │
│ Email *                      │
│ [Disabled - grayed out]      │
│                              │
│ Company (Optional)           │
│ [Disabled - grayed out]      │
│                              │
│ Phone (Optional)             │
│ [Disabled - grayed out]      │
│                              │
│ ┌─────────────────────────┐  │
│ │ ⏳ Creating Quotation... │  │
│ │  (disabled button)      │  │
│ └─────────────────────────┘  │
└──────────────────────────────┘
```

## Summary

✅ **Professional Design** - Matches site theme
✅ **Fully Responsive** - Works on all devices
✅ **Accessible** - Keyboard and screen reader support
✅ **User Friendly** - Clear labels and validation
✅ **Smooth Animations** - Professional transitions
✅ **Mobile Optimized** - Touch-friendly sizing
✅ **Dark Theme** - Consistent with site

