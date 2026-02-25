export interface PropDef {
  name: string;
  required?: boolean;
  default?: string;
  description: string;
  type: string;
}

export interface VariantConfig {
  name: string;
  label: string;
}

export interface ComponentDoc {
  title: string;
  description: string;
  importCode: string;
  variants: VariantConfig[];
  props: PropDef[];
}

const intentVariants: VariantConfig[] = [
  { name: "default", label: "Default" },
  { name: "neutral", label: "Neutral" },
  { name: "success", label: "Success" },
  { name: "destructive", label: "Destructive" },
  { name: "warning", label: "Warning" },
];

const intentVariantsNoNeutral: VariantConfig[] = [
  { name: "default", label: "Default" },
  { name: "success", label: "Success" },
  { name: "destructive", label: "Destructive" },
  { name: "warning", label: "Warning" },
];

const defaultOnly: VariantConfig[] = [{ name: "default", label: "Default" }];

export const componentDocs: Record<string, ComponentDoc> = {
  accordion: {
    title: "Accordion",
    description:
      "A vertically stacked set of collapsible sections. Built on Radix UI Accordion.",
    importCode: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"`,
    variants: defaultOnly,
    props: [
      { name: "type", required: true, type: '"single" | "multiple"', description: "Whether one or multiple items can be open at once." },
      { name: "value", type: "string | string[]", description: "Controlled open item(s)." },
      { name: "defaultValue", type: "string | string[]", description: "Initially open item(s) when uncontrolled." },
      { name: "collapsible", type: "boolean", default: "false", description: 'Allow all items to close when type is "single".' },
      { name: "disabled", type: "boolean", description: "Prevent all items from being interactive." },
    ],
  },

  alert: {
    title: "Alert",
    description:
      "A prominent callout for important messages, with an optional icon and left border accent.",
    importCode: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"`,
    variants: intentVariantsNoNeutral,
    props: [
      { name: "intent", type: '"default" | "success" | "destructive" | "warning"', default: '"default"', description: "Color intent of the alert." },
      { name: "children", required: true, type: "ReactNode", description: "Alert content, typically AlertTitle and AlertDescription." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  "alert-dialog": {
    title: "Alert Dialog",
    description:
      "A modal dialog that interrupts the user for a critical confirmation. Built on Radix UI AlertDialog.",
    importCode: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"`,
    variants: defaultOnly,
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "children", required: true, type: "ReactNode", description: "AlertDialogTrigger and AlertDialogContent." },
    ],
  },

  avatar: {
    title: "Avatar",
    description:
      "A circular image element with a fallback for representing users. Built on Radix UI Avatar.",
    importCode: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"`,
    variants: defaultOnly,
    props: [
      { name: "src", type: "string", description: "Image source URL (on AvatarImage)." },
      { name: "alt", type: "string", description: "Alt text for the avatar image (on AvatarImage)." },
      { name: "delayMs", type: "number", description: "Delay in ms before showing fallback (on AvatarFallback)." },
      { name: "className", type: "string", description: "Additional CSS classes to control size and shape." },
    ],
  },

  badge: {
    title: "Badge",
    description:
      "A small label for categorization or status, available in solid, outline, and subdued variants.",
    importCode: `import { Badge } from "@/components/ui/badge"`,
    variants: intentVariants,
    props: [
      { name: "variant", type: '"default" | "outline" | "subdued"', default: '"default"', description: "Visual style of the badge." },
      { name: "intent", type: '"default" | "neutral" | "success" | "destructive" | "warning"', default: '"default"', description: "Color intent of the badge." },
      { name: "children", required: true, type: "ReactNode", description: "Badge content." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  breadcrumb: {
    title: "Breadcrumb",
    description:
      "A navigation aid showing the user's location within a page hierarchy.",
    importCode: `import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"`,
    variants: defaultOnly,
    props: [
      { name: "separator", type: "ReactNode", description: "Custom separator element (on Breadcrumb)." },
      { name: "href", type: "string", description: "Link destination (on BreadcrumbLink)." },
      { name: "children", required: true, type: "ReactNode", description: "Breadcrumb items." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  button: {
    title: "Button",
    description:
      "A clickable element for triggering actions, with multiple visual variants and color intents.",
    importCode: `import { Button } from "@/components/ui/button"`,
    variants: intentVariants,
    props: [
      { name: "variant", type: '"default" | "outline" | "ghost" | "text"', default: '"default"', description: "Visual style of the button." },
      { name: "intent", type: '"default" | "neutral" | "success" | "destructive" | "warning"', default: '"default"', description: "Color intent of the button." },
      { name: "size", type: '"sm" | "default" | "lg" | "icon"', default: '"default"', description: "Size of the button." },
      { name: "asChild", type: "boolean", default: "false", description: "Render as child element using Radix Slot." },
      { name: "disabled", type: "boolean", description: "Whether the button is disabled." },
      { name: "children", required: true, type: "ReactNode", description: "Button content." },
    ],
  },

  card: {
    title: "Card",
    description:
      "A container with a border and shadow for grouping related content into sections.",
    importCode: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"`,
    variants: defaultOnly,
    props: [
      { name: "children", required: true, type: "ReactNode", description: "Card content, typically CardHeader, CardContent, and CardFooter." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  checkbox: {
    title: "Checkbox",
    description:
      "A toggle control for selecting one or more options. Built on Radix UI Checkbox.",
    importCode: `import { Checkbox } from "@/components/ui/checkbox"`,
    variants: defaultOnly,
    props: [
      { name: "checked", type: 'boolean | "indeterminate"', description: "Controlled checked state." },
      { name: "defaultChecked", type: "boolean", description: "Initial checked state when uncontrolled." },
      { name: "onCheckedChange", type: '(checked: boolean | "indeterminate") => void', description: "Callback when checked state changes." },
      { name: "disabled", type: "boolean", description: "Whether the checkbox is disabled." },
      { name: "required", type: "boolean", description: "Whether the checkbox is required in a form." },
    ],
  },

  dialog: {
    title: "Dialog",
    description:
      "A modal overlay for presenting content that requires user attention. Built on Radix UI Dialog.",
    importCode: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"`,
    variants: defaultOnly,
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
      { name: "modal", type: "boolean", default: "true", description: "Whether the dialog blocks interaction with the rest of the page." },
      { name: "children", required: true, type: "ReactNode", description: "DialogTrigger and DialogContent." },
    ],
  },

  "dropdown-menu": {
    title: "Dropdown Menu",
    description:
      "A menu of actions or options revealed by a trigger button. Built on Radix UI DropdownMenu.",
    importCode: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from "@/components/ui/dropdown-menu"`,
    variants: defaultOnly,
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
      { name: "modal", type: "boolean", default: "true", description: "Whether the menu blocks interaction with the rest of the page." },
      { name: "children", required: true, type: "ReactNode", description: "DropdownMenuTrigger and DropdownMenuContent." },
    ],
  },

  input: {
    title: "Input",
    description:
      "A single-line text field for user input with focus ring and placeholder support.",
    importCode: `import { Input } from "@/components/ui/input"`,
    variants: defaultOnly,
    props: [
      { name: "type", type: "string", default: '"text"', description: "HTML input type (text, email, password, etc.)." },
      { name: "placeholder", type: "string", description: "Placeholder text shown when empty." },
      { name: "value", type: "string", description: "Controlled input value." },
      { name: "onChange", type: "(e: ChangeEvent) => void", description: "Callback when value changes." },
      { name: "disabled", type: "boolean", description: "Whether the input is disabled." },
    ],
  },

  label: {
    title: "Label",
    description:
      "An accessible text label for form controls. Built on Radix UI Label.",
    importCode: `import { Label } from "@/components/ui/label"`,
    variants: defaultOnly,
    props: [
      { name: "htmlFor", type: "string", description: "ID of the form element this label is associated with." },
      { name: "children", required: true, type: "ReactNode", description: "Label text." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  notice: {
    title: "Notice",
    description:
      "A full-width banner for inline status messages with optional dismiss button.",
    importCode: `import { Notice } from "@/components/ui/notice"`,
    variants: intentVariantsNoNeutral,
    props: [
      { name: "intent", type: '"default" | "success" | "destructive" | "warning"', default: '"default"', description: "Color intent of the notice." },
      { name: "onDismiss", type: "() => void", description: "Callback to dismiss the notice. Shows a close button when provided." },
      { name: "children", required: true, type: "ReactNode", description: "Notice content." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  pagination: {
    title: "Pagination",
    description:
      "A navigation component for moving between pages of content.",
    importCode: `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"`,
    variants: defaultOnly,
    props: [
      { name: "isActive", type: "boolean", description: "Whether the page link is the current page (on PaginationLink)." },
      { name: "href", type: "string", description: "Link destination for page navigation (on PaginationLink)." },
      { name: "children", required: true, type: "ReactNode", description: "Page number or content (on PaginationLink)." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  popover: {
    title: "Popover",
    description:
      "A floating panel anchored to a trigger element for displaying rich content. Built on Radix UI Popover.",
    importCode: `import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"`,
    variants: defaultOnly,
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment of the popover relative to the trigger (on PopoverContent)." },
      { name: "sideOffset", type: "number", default: "4", description: "Distance in pixels from the trigger (on PopoverContent)." },
      { name: "children", required: true, type: "ReactNode", description: "Popover content." },
    ],
  },

  progress: {
    title: "Progress",
    description:
      "A horizontal bar indicating completion or loading progress. Built on Radix UI Progress.",
    importCode: `import { Progress } from "@/components/ui/progress"`,
    variants: defaultOnly,
    props: [
      { name: "value", type: "number", description: "Current progress value (0-100)." },
      { name: "max", type: "number", default: "100", description: "Maximum progress value." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  "radio-group": {
    title: "Radio Group",
    description:
      "A set of mutually exclusive options where only one can be selected. Built on Radix UI RadioGroup.",
    importCode: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`,
    variants: defaultOnly,
    props: [
      { name: "value", type: "string", description: "Controlled selected value." },
      { name: "defaultValue", type: "string", description: "Initial selected value when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Callback when the selected value changes." },
      { name: "disabled", type: "boolean", description: "Whether the entire group is disabled." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Layout direction of the radio items." },
    ],
  },

  select: {
    title: "Select",
    description:
      "A dropdown control for choosing a single value from a list of options. Built on Radix UI Select.",
    importCode: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select"`,
    variants: defaultOnly,
    props: [
      { name: "value", type: "string", description: "Controlled selected value." },
      { name: "defaultValue", type: "string", description: "Initial selected value when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Callback when the selected value changes." },
      { name: "placeholder", type: "string", description: "Placeholder text when no value is selected (on SelectValue)." },
      { name: "disabled", type: "boolean", description: "Whether the select is disabled." },
    ],
  },

  separator: {
    title: "Separator",
    description:
      "A visual divider between content sections, horizontal or vertical. Built on Radix UI Separator.",
    importCode: `import { Separator } from "@/components/ui/separator"`,
    variants: defaultOnly,
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the separator." },
      { name: "decorative", type: "boolean", default: "true", description: "Whether the separator is purely decorative (hidden from accessibility tree)." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  skeleton: {
    title: "Skeleton",
    description:
      "An animated placeholder that mimics content layout while data is loading.",
    importCode: `import { Skeleton } from "@/components/ui/skeleton"`,
    variants: defaultOnly,
    props: [
      { name: "className", required: true, type: "string", description: "CSS classes to define the size and shape (e.g., h-4 w-48 rounded-full)." },
    ],
  },

  slider: {
    title: "Slider",
    description:
      "A draggable range input for selecting a numeric value. Built on Radix UI Slider.",
    importCode: `import { Slider } from "@/components/ui/slider"`,
    variants: defaultOnly,
    props: [
      { name: "value", type: "number[]", description: "Controlled value(s)." },
      { name: "defaultValue", type: "number[]", description: "Initial value(s) when uncontrolled." },
      { name: "onValueChange", type: "(value: number[]) => void", description: "Callback when the value changes." },
      { name: "min", type: "number", default: "0", description: "Minimum allowed value." },
      { name: "max", type: "number", default: "100", description: "Maximum allowed value." },
      { name: "step", type: "number", default: "1", description: "Step increment between values." },
    ],
  },

  switch: {
    title: "Switch",
    description:
      "A toggle control for switching between on and off states. Built on Radix UI Switch.",
    importCode: `import { Switch } from "@/components/ui/switch"`,
    variants: defaultOnly,
    props: [
      { name: "checked", type: "boolean", description: "Controlled checked state." },
      { name: "defaultChecked", type: "boolean", description: "Initial checked state when uncontrolled." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Callback when the checked state changes." },
      { name: "disabled", type: "boolean", description: "Whether the switch is disabled." },
      { name: "required", type: "boolean", description: "Whether the switch is required in a form." },
    ],
  },

  table: {
    title: "Table",
    description:
      "A structured data display with header, body, and footer sections for tabular content.",
    importCode: `import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table"`,
    variants: defaultOnly,
    props: [
      { name: "children", required: true, type: "ReactNode", description: "Table sections (TableHeader, TableBody, TableFooter)." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  tabs: {
    title: "Tabs",
    description:
      "A set of layered content panels activated by tab triggers. Built on Radix UI Tabs.",
    importCode: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"`,
    variants: defaultOnly,
    props: [
      { name: "value", type: "string", description: "Controlled active tab value." },
      { name: "defaultValue", type: "string", description: "Initially active tab when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Callback when the active tab changes." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction of the tab list." },
      { name: "children", required: true, type: "ReactNode", description: "TabsList and TabsContent elements." },
    ],
  },

  textarea: {
    title: "Textarea",
    description:
      "A multi-line text field for longer user input with resize support.",
    importCode: `import { Textarea } from "@/components/ui/textarea"`,
    variants: defaultOnly,
    props: [
      { name: "placeholder", type: "string", description: "Placeholder text shown when empty." },
      { name: "value", type: "string", description: "Controlled textarea value." },
      { name: "onChange", type: "(e: ChangeEvent) => void", description: "Callback when value changes." },
      { name: "rows", type: "number", description: "Number of visible text lines." },
      { name: "disabled", type: "boolean", description: "Whether the textarea is disabled." },
    ],
  },

  toast: {
    title: "Toast",
    description:
      "A brief notification that appears temporarily to provide feedback on an action.",
    importCode: `import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"`,
    variants: intentVariantsNoNeutral,
    props: [
      { name: "intent", type: '"default" | "success" | "destructive" | "warning"', default: '"default"', description: "Color intent of the toast." },
      { name: "onClose", type: "() => void", description: "Callback to close the toast. Shows a close button when provided." },
      { name: "children", required: true, type: "ReactNode", description: "Toast content, typically ToastTitle and ToastDescription." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
  },

  tooltip: {
    title: "Tooltip",
    description:
      "A small popup that displays additional information on hover or focus. Built on Radix UI Tooltip.",
    importCode: `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"`,
    variants: defaultOnly,
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
      { name: "delayDuration", type: "number", default: "700", description: "Delay in ms before the tooltip appears (on TooltipProvider)." },
      { name: "sideOffset", type: "number", default: "4", description: "Distance in pixels from the trigger (on TooltipContent)." },
      { name: "children", required: true, type: "ReactNode", description: "Tooltip content text or elements (on TooltipContent)." },
    ],
  },
};
