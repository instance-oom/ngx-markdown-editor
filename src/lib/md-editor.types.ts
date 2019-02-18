export interface MdEditorOption {
  showBorder?: boolean          // Show editor component's border
  hideIcons?: Array<string>     // ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen'], Default is empty
  scrollPastEnd?: number        // The option for ace editor
  enablePreviewContentClick?: boolean  // Allow user fire the click event on the preview panel, like href etc.
  resizable?: boolean           // Allow resize the editor
  markedjsOpt?: MarkedjsOption  // The markedjs option, see https://marked.js.org/#/USING_ADVANCED.md#options
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
