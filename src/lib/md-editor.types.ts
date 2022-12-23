export interface MdEditorOption {
  showPreviewPanel?: boolean    // Show preview panel, Default is `true`
  showBorder?: boolean          // Show editor component's border
  hideIcons?: Array<string>     // ['Bold', 'Italic', 'Heading', 'Reference', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen'], Default is empty
  usingFontAwesome5?: boolean   // Using font awesome with version 5, Default is false
  fontAwesomeVersion?: '4' | '5' | '6'   // FontAwesome Version, 4/5/6, default is 4
  scrollPastEnd?: number        // The option for ace editor
  enablePreviewContentClick?: boolean  // Allow user fire the click event on the preview panel, like href etc.
  resizable?: boolean           // Allow resize the editor
  markedjsOpt?: MarkedjsOption  // The markedjs option, see https://marked.js.org/#/USING_ADVANCED.md#options
  customRender?: CustomRender   // Custom markedjs render
  customIcons?: {               // Custom icons in toolbar
    Bold?: CustomIcon;
    Italic?: CustomIcon;
    Heading?: CustomIcon;
    Reference?: CustomIcon;
    Link?: CustomIcon;
    Image?: CustomIcon;
    UnorderedList?: CustomIcon;
    OrderedList?: CustomIcon;
    CodeBlock?: CustomIcon;
    ShowPreview?: CustomIcon;
    HidePreview?: CustomIcon;
    FullScreen?: CustomIcon;
    CheckBox_UnChecked?: CustomIcon;
    CheckBox_Checked?: CustomIcon;
  };
}

export interface UploadResult {
  isImg: boolean
  name: string
  url: string
}

export interface MarkedjsOption {
  baseUrl?: string             // Default null
  breaks?: boolean             // Default false
  gfm?: boolean                // Default true
  headerIds?: boolean          // Default true
  headerPrefix?: string        // Default ''
  langPrefix?: string          // Default 'language-'
  mangle?: boolean             // Default true
  pedantic?: boolean           // Default false
  sanitize?: boolean           // Default false
  sanitizer?: Function         // Default null
  silent?: boolean             // Default false
  smartLists?: boolean         // Default false
  smartypants?: boolean        // Default false
  tables?: boolean             // Default true
  xhtml?: boolean              // Default false
}

export interface CustomRender {
  image?: Function     // Image Render
  table?: Function     // Table Render
  code?: Function      // Code Render
  listitem?: Function  // Listitem Render
}

export interface CustomIcon {
  fontClass: string
}

export const DEFAULT_ICONS = {
  fontAwesome4: {
    Bold: { fontClass: 'fa fa-bold' },
    Italic: { fontClass: 'fa fa-italic' },
    Heading: { fontClass: 'fa fa-header' },
    Reference: { fontClass: 'fa fa-quote-left' },
    Link: { fontClass: 'fa fa-link' },
    Image: { fontClass: 'fa fa-image' },
    UnorderedList: { fontClass: 'fa fa-list-ul' },
    OrderedList: { fontClass: 'fa fa-list-ol' },
    CodeBlock: { fontClass: 'fa fa-file-code-o' },
    ShowPreview: { fontClass: 'fa fa-eye' },
    HidePreview: { fontClass: 'fa fa-eye-slash' },
    FullScreen: { fontClass: 'fa fa-arrows-alt' },
    CheckBox_UnChecked: { fontClass: 'fa fa-square-o' },
    CheckBox_Checked: { fontClass: 'fa fa-check-square' },
  },
  fontAwesome5: {
    Bold: { fontClass: 'fas fa-bold' },
    Italic: { fontClass: 'fas fa-italic' },
    Heading: { fontClass: 'fas fa-heading' },
    Reference: { fontClass: 'fas fa-quote-left' },
    Link: { fontClass: 'fas fa-link' },
    Image: { fontClass: 'fas fa-image' },
    UnorderedList: { fontClass: 'fas fa-list-ul' },
    OrderedList: { fontClass: 'fas fa-list-ol' },
    CodeBlock: { fontClass: 'fas fa-file-code' },
    ShowPreview: { fontClass: 'fas fa-eye' },
    HidePreview: { fontClass: 'fas fa-eye-slash' },
    FullScreen: { fontClass: 'fas fa-compress' },
    CheckBox_UnChecked: { fontClass: 'far fa-square' },
    CheckBox_Checked: { fontClass: 'fas fa-check-square' }
  },
  fontAwesome6: {
    Bold: { fontClass: 'fa-solid fa-bold' },
    Italic: { fontClass: 'fa-solid fa-italic' },
    Heading: { fontClass: 'fa-solid fa-heading' },
    Reference: { fontClass: 'fa-solid fa-quote-left' },
    Link: { fontClass: 'fa-solid fa-link' },
    Image: { fontClass: 'fa-solid fa-image' },
    UnorderedList: { fontClass: 'fa-solid fa-list-ul' },
    OrderedList: { fontClass: 'fa-solid fa-list-ol' },
    CodeBlock: { fontClass: 'fa-solid fa-file-code' },
    ShowPreview: { fontClass: 'fa-solid fa-eye' },
    HidePreview: { fontClass: 'fa-solid fa-eye-slash' },
    FullScreen: { fontClass: 'fa-solid fa-maximize' },
    CheckBox_UnChecked: { fontClass: 'fa-regular fa-square' },
    CheckBox_Checked: { fontClass: 'fa-solid fa-check-square' }
  }
}
