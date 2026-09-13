"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  Clock,
  Copy,
  CornerDownLeft,
  CornerDownRight,
  Dot,
  Ellipsis,
  EllipsisVertical,
  Folder,
  Globe,
  Heart,
  Home,
  ImageIcon,
  Inbox,
  Lightbulb,
  Link,
  Loader,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  Paintbrush,
  Palette,
  PanelLeft,
  PanelRight,
  Pause,
  Pencil,
  Pipette,
  Play,
  Plus,
  RectangleHorizontal,
  Rocket,
  RotateCcw,
  Scaling,
  Search,
  Settings,
  Shield,
  SkipForward,
  SlidersHorizontal,
  SquareLibrary,
  Star,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

export interface IconComponentProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export type IconComponent = ComponentType<IconComponentProps>;

export type IconName =
  | "chevron-right"
  | "chevron-down"
  | "x"
  | "copy"
  | "menu"
  | "dot"
  | "monitor"
  | "sun"
  | "moon"
  | "rectangle-horizontal"
  | "circle"
  | "square-library"
  | "clock"
  | "star"
  | "settings"
  | "plus"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "search"
  | "loader"
  | "users"
  | "lock"
  | "mail"
  | "bell"
  | "shield"
  | "palette"
  | "lightbulb"
  | "rocket"
  | "heart"
  | "paintbrush"
  | "brain"
  | "globe"
  | "user"
  | "image"
  | "link"
  | "check"
  | "rotate-ccw"
  | "play"
  | "pause"
  | "pipette"
  | "home"
  | "message-circle"
  | "inbox"
  | "pencil"
  | "scaling"
  | "skip-forward"
  | "corner-down-right"
  | "corner-down-left"
  | "panel-left"
  | "panel-right"
  | "chevrons-up-down"
  | "more-horizontal"
  | "more-vertical"
  | "calendar"
  | "folder"
  | "sliders-horizontal";

export const defaultIcons: Record<IconName, IconComponent> = {
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  bell: Bell,
  brain: Brain,
  calendar: Calendar,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "chevrons-up-down": ChevronsUpDown,
  circle: Circle,
  clock: Clock,
  copy: Copy,
  "corner-down-left": CornerDownLeft,
  "corner-down-right": CornerDownRight,
  dot: Dot,
  folder: Folder,
  globe: Globe,
  heart: Heart,
  home: Home,
  image: ImageIcon,
  inbox: Inbox,
  lightbulb: Lightbulb,
  link: Link,
  loader: Loader,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  "message-circle": MessageCircle,
  monitor: Monitor,
  moon: Moon,
  "more-horizontal": Ellipsis,
  "more-vertical": EllipsisVertical,
  paintbrush: Paintbrush,
  palette: Palette,
  "panel-left": PanelLeft,
  "panel-right": PanelRight,
  pause: Pause,
  pencil: Pencil,
  pipette: Pipette,
  play: Play,
  plus: Plus,
  "rectangle-horizontal": RectangleHorizontal,
  rocket: Rocket,
  "rotate-ccw": RotateCcw,
  scaling: Scaling,
  search: Search,
  settings: Settings,
  shield: Shield,
  "skip-forward": SkipForward,
  "sliders-horizontal": SlidersHorizontal,
  "square-library": SquareLibrary,
  star: Star,
  sun: Sun,
  user: User,
  users: Users,
  x: X,
};

const IconContext = createContext<Record<IconName, IconComponent> | null>(null);

/**
 * Returns a single icon component for the given name.
 * Falls back to the default (Lucide) set if no provider is present.
 */
function useIcon(name: IconName): IconComponent {
  const icons = useContext(IconContext);
  return (icons ?? defaultIcons)[name];
}

/**
 * Returns the full icon map.
 * Falls back to the default (Lucide) set if no provider is present.
 */
function useIcons(): Record<IconName, IconComponent> {
  const icons = useContext(IconContext);
  return icons ?? defaultIcons;
}

/**
 * Swap some or all icons for components from another library.
 * Names left out of `icons` keep their default (Lucide) component.
 */
function IconProvider({
  children,
  icons,
}: {
  children: ReactNode;
  icons?: Partial<Record<IconName, IconComponent>>;
}) {
  const value = useMemo(() => ({ ...defaultIcons, ...icons }), [icons]);
  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}

export { IconProvider, useIcon, useIcons };
