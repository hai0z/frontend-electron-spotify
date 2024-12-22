export interface YoutubeSearchResponse {
  header: Header;
  results: Result[];
  refinements: any[];
  estimated_results: number;
  sub_menu: Command;
}

export interface Result {
  type: string;
  id?: string;
  title: Title3;
  snippets?: Snippet[];
  expandable_metadata?: Expandablemetadatum | null;
  thumbnails?: Collapsedthumbnail[];
  thumbnail_overlays?: Thumbnailoverlay[];
  author?: Author;
  badges?: Badge2[];
  endpoint?: Endpoint6;
  published?: Published;
  view_count?: Title2;
  short_view_count?: Title2;
  duration?: Duration;
  show_action_menu?: boolean;
  is_watched?: boolean;
  menu?: Menu;
  search_video_result_entity_key?: string;
  items?: Item2[];
}

interface Item2 {
  type: string;
  entity_id: string;
  accessibility_text: string;
  thumbnail: Collapsedthumbnail[];
  on_tap_endpoint: Ontapendpoint2;
  menu_on_tap: Menuontap;
  index_in_collection: number;
  menu_on_tap_a11y_label: string;
  overlay_metadata: Overlaymetadata;
  inline_player_data: Inlineplayerdata;
  badge?: Badge3;
}

interface Badge3 {
  type: string;
  text: string;
  style: string;
  accessibility_label: string;
}

interface Inlineplayerdata {
  type: string;
  command: Command;
  name: string;
  payload: Payload12;
  metadata: Metadata2;
}

interface Payload12 {
  videoId: string;
  playerParams: string;
  playerExtraUrlParams: UserFeedbackEndpointProductSpecificValueData[];
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

interface Overlaymetadata {
  primary_text: Title;
  secondary_text: Title;
}

interface Menuontap {
  type: string;
  name: string;
  payload: Payload11;
  metadata: Payload2;
}

interface Payload11 {
  panelLoadingStrategy: PanelLoadingStrategy;
}

interface PanelLoadingStrategy {
  inlineContent: InlineContent;
}

interface InlineContent {
  sheetViewModel: SheetViewModel;
}

interface SheetViewModel {
  content: Content;
}

interface Content {
  listViewModel: ListViewModel;
}

interface ListViewModel {
  listItems: ListItem[];
}

interface ListItem {
  listItemViewModel: ListItemViewModel;
}

interface ListItemViewModel {
  title: Title4;
  leadingImage: LeadingImage;
  rendererContext: RendererContext;
}

interface RendererContext {
  loggingContext?: LoggingContext2;
  commandContext: CommandContext;
}

interface CommandContext {
  onTap: OnTap;
}

interface OnTap {
  innertubeCommand: InnertubeCommand;
}

interface InnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  signalServiceEndpoint?: SignalServiceEndpoint;
  userFeedbackEndpoint?: UserFeedbackEndpoint;
}

interface UserFeedbackEndpoint {
  additionalDatas: AdditionalData[];
}

interface AdditionalData {
  userFeedbackEndpointProductSpecificValueData: UserFeedbackEndpointProductSpecificValueData;
}

interface UserFeedbackEndpointProductSpecificValueData {
  key: string;
  value: string;
}

interface SignalServiceEndpoint {
  signal: string;
  actions: Action5[];
}

interface Action5 {
  clickTrackingParams: string;
  addToPlaylistCommand: AddToPlaylistCommand;
}

interface CommandMetadata2 {
  webCommandMetadata: WebCommandMetadata2;
}

interface WebCommandMetadata2 {
  sendPost?: boolean;
  ignoreNavigation?: boolean;
}

interface LoggingContext2 {
  loggingDirectives: LoggingDirectives;
}

interface LoggingDirectives {
  trackingParams: string;
}

interface LeadingImage {
  sources: Source[];
}

interface Source {
  clientResource: ClientResource;
}

interface ClientResource {
  imageName: string;
}

interface Title4 {
  content: string;
}

interface Ontapendpoint2 {
  type: string;
  command: Command;
  name: string;
  payload: Payload10;
  metadata: Metadata2;
}

interface Payload10 {
  videoId: string;
  playerParams: string;
  thumbnail: Thumbnail;
  overlay: Overlay;
  params: string;
  sequenceProvider: string;
  sequenceParams: string;
  loggingContext: LoggingContext;
  ustreamerConfig: string;
}

interface LoggingContext {
  vssLoggingContext: VssLoggingContext;
  qoeLoggingContext: VssLoggingContext;
}

interface VssLoggingContext {
  serializedContextData: string;
}

interface Overlay {
  reelPlayerOverlayRenderer: ReelPlayerOverlayRenderer;
}

interface ReelPlayerOverlayRenderer {
  style: string;
  trackingParams: string;
  reelPlayerNavigationModel: string;
}

interface Thumbnail {
  thumbnails: Collapsedthumbnail[];
  isOriginalAspectRatio: boolean;
}

interface Menu {
  type: string;
  items: Item[];
  flexible_items: any[];
  top_level_buttons: any[];
  label: string;
}

interface Item {
  type: string;
  text: string;
  icon_type: string;
  endpoint: Endpoint7;
}

interface Endpoint7 {
  type: string;
  command: Command3;
  name: string;
  payload: Payload9;
  metadata: Metadata4;
}

interface Payload9 {
  signal?: string;
  actions?: Action4[];
  serializedShareEntity?: string;
  commands?: Command4[];
}

interface Command4 {
  clickTrackingParams: string;
  openPopupAction: OpenPopupAction;
}

interface OpenPopupAction {
  popup: Popup2;
  popupType: string;
  beReused: boolean;
}

interface Popup2 {
  unifiedSharePanelRenderer: UnifiedSharePanelRenderer;
}

interface UnifiedSharePanelRenderer {
  trackingParams: string;
  showLoadingSpinner: boolean;
}

interface Action4 {
  addToPlaylistCommand: AddToPlaylistCommand;
}

interface Duration {
  text: string;
  seconds: number;
}

interface Published {
  text?: string;
}

interface Endpoint6 {
  type: string;
  command: Command;
  name: string;
  payload: Payload8;
  metadata: Metadata2;
}

interface Payload8 {
  videoId: string;
  params: string;
  playerParams: string;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

interface Badge2 {
  type: string;
  style: string;
  label: string;
}

interface Author {
  id: string;
  name: string;
  thumbnails: Collapsedthumbnail[];
  endpoint: Endpoint5;
  badges: Badge[];
  url: string;
  is_moderator?: boolean;
  is_verified?: boolean;
  is_verified_artist?: boolean;
}

interface Badge {
  type: string;
  icon_type: string;
  style: string;
  tooltip: string;
}

interface Endpoint5 {
  type: string;
  command: Command;
  name: string;
  payload: Payload7;
  metadata: Metadata2;
}

interface Payload7 {
  browseId: string;
  canonicalBaseUrl: string;
}

interface Thumbnailoverlay {
  type: string;
  text?: Title | string;
  style?: string;
  is_toggled?: boolean;
  icon_type?: Icontype;
  tooltip?: Icontype;
  toggled_endpoint?: Toggledendpoint;
  untoggled_endpoint?: Untoggledendpoint;
}

interface Untoggledendpoint {
  type: string;
  command: Command3;
  name: string;
  payload: Payload6;
  metadata: Metadata4;
}

interface Metadata4 {
  api_url?: string;
  send_post: boolean;
}

interface Payload6 {
  playlistId?: string;
  actions: Action3[];
  signal?: string;
}

interface Action3 {
  addedVideoId?: string;
  action?: string;
  addToPlaylistCommand?: AddToPlaylistCommand;
}

interface AddToPlaylistCommand {
  openMiniplayer: boolean;
  videoId: string;
  listType: string;
  onCreateListCommand: OnCreateListCommand;
  videoIds: string[];
}

interface OnCreateListCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  createPlaylistServiceEndpoint: Payload5;
}

interface CommandMetadata {
  webCommandMetadata: WebCommandMetadata;
}

interface WebCommandMetadata {
  sendPost: boolean;
  apiUrl: string;
}

interface Command3 {
  type: string;
  actions?: Action2[];
  signal?: string;
}

interface Action2 {
  type: string;
  open_miniplayer: boolean;
  video_id: string;
  list_type: string;
  endpoint: Endpoint4;
  video_ids: string[];
}

interface Endpoint4 {
  type: string;
  command: Command;
  name: string;
  payload: Payload5;
  metadata: Metadata3;
}

interface Payload5 {
  videoIds: string[];
  params: string;
}

interface Toggledendpoint {
  type: string;
  command: Command;
  name: string;
  payload: Payload4;
  metadata: Metadata3;
}

interface Metadata3 {
  api_url: string;
  send_post: boolean;
}

interface Payload4 {
  playlistId: string;
  actions: Action[];
}

interface Action {
  action: string;
  removedVideoId: string;
}

interface Icontype {
  toggled: string;
  untoggled: string;
}

interface Expandablemetadatum {
  type: string;
  header: Header2;
  expanded_content: Expandedcontent;
  expand_button: Previousbutton;
  collapse_button: Previousbutton;
}

interface Expandedcontent {
  type: string;
  cards: Card[];
  header: null;
  previous_button: Previousbutton;
  next_button: Previousbutton;
}

interface Previousbutton {
  type: string;
  icon_type: string;
  is_disabled: boolean;
  endpoint: Endpoint3;
}

interface Endpoint3 {
  type: string;
  payload: Payload2;
  metadata: Payload2;
}

interface Card {
  type: string;
  title: Title;
  time_description: Title;
  thumbnail: Collapsedthumbnail[];
  on_tap_endpoint: Ontapendpoint;
  layout: string;
  is_highlighted: boolean;
}

interface Ontapendpoint {
  type: string;
  command: Command;
  name: string;
  payload: Payload3;
  metadata: Metadata2;
}

interface Metadata2 {
  url: string;
  page_type: string;
  api_url: string;
}

interface Payload3 {
  videoId: string;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
  startTimeSeconds?: number;
}

interface WatchEndpointSupportedOnesieConfig {
  html5PlaybackOnesieConfig: Html5PlaybackOnesieConfig;
}

interface Html5PlaybackOnesieConfig {
  commonConfig: CommonConfig;
}

interface CommonConfig {
  url: string;
}

interface Header2 {
  collapsed_title: Title;
  collapsed_thumbnail: Collapsedthumbnail[];
  collapsed_label: Title;
  expanded_title: Title;
}

interface Collapsedthumbnail {
  url: string;
  width: number;
  height: number;
}

interface Snippet {
  text: Title;
  hover_text: Title;
}

interface Title3 {
  runs?: Run[];
  text: string;
}

interface Header {
  type: string;
  chip_bar: null;
  search_filter_button: Searchfilterbutton;
}

interface Searchfilterbutton {
  type: string;
  text: string;
  tooltip: string;
  icon_type: string;
  is_disabled: boolean;
  endpoint: Endpoint2;
}

interface Endpoint2 {
  type: string;
  command: Command2;
  open_popup: Command2;
  payload: Payload2;
  metadata: Payload2;
}

interface Payload2 {}

interface Command2 {
  type: string;
  popup: Popup;
  popup_type: string;
}

interface Popup {
  type: string;
  title: Title;
  groups: Group[];
}

interface Group {
  type: string;
  title: Title2;
  filters: Filter[];
}

interface Filter {
  type: string;
  label: Title2;
  endpoint: Endpoint;
  tooltip: string;
  status?: string;
}

interface Endpoint {
  type: string;
  payload: Payload;
  metadata: Metadata;
  command?: Command;
  name?: string;
}

interface Command {
  type: string;
}

interface Metadata {
  url?: string;
  page_type?: string;
  api_url?: string;
}

interface Payload {
  query?: string;
  params?: string;
}

interface Title2 {
  text: string;
}

interface Title {
  runs: Run[];
  text: string;
}

interface Run {
  text: string;
  bold: boolean;
  italics: boolean;
  strikethrough: boolean;
  deemphasize: boolean;
}
