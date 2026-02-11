

# Three Template Tweaks

## 1. RPG Quest — "EQUIPPED" Confirmation (Stage 3)

Add an `equipped` state. When "Yes! Equip" is clicked, fire confetti AND replace the two buttons with a bold RPG-style confirmation message:

- A large animated "ITEM EQUIPPED!" text in gold/green with a scale-in + glow animation
- Below it: "Happy Valentine's Day!" and the sender's name
- The treasure chest emoji changes to a sword/shield emoji to show the item is now "worn"

**File:** `src/templates/RPGQuest.tsx`
- Add `const [equipped, setEquipped] = useState(false)`
- On "Yes! Equip" click: set `equipped = true` and fire confetti
- Conditionally render the equipped confirmation in place of the buttons

---

## 2. 90s Desktop — Bigger Photos + Pink Page Mosaic (Stage 2 & BSOD)

### Bigger desktop photo icons
Change the photo thumbnails from `h-12 w-12` to `h-36 w-36` (or similar) so they look like proper desktop file previews.

### Photo mosaic on the pink BSOD page
When `bsodPink` is true, render a subtle photo grid behind the proposal text (same approach as Mixtape Stage 3: low opacity, slight rotation, pointer-events-none).

**File:** `src/templates/DesktopSimulator.tsx`
- Lines 146-153: Change `h-12 w-12` to `h-24 w-24` on photo icons
- Lines 276-311 (the pink BSOD content): Add a background mosaic div with `config.photos` at ~10% opacity

---

## 3. Love Receipt — Valentine Question Above "Sign Here" (Stage 3)

Between the "AUTHORIZATION REQUIRED" divider and the "Sign Here" button, add:
- "Will you be my Valentine?" in a slightly larger font
- "From: [senderName]" below it

**File:** `src/templates/LoveReceipt.tsx`
- Lines 197-199: After the "AUTHORIZATION REQUIRED" paragraph, insert the question text and sender name before the Sign Here button

