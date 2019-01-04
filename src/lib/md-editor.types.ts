export interface MdEditorOption {
  showBorder: boolean       // Show editor component's border
  hideIcons: Array<string>  // ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen'], Default is empty
  scrollPastEnd: number     // The option for ace editor
  enablePreviewContentClick: boolean  // Allow user fire the click event on the preview panel, like href etc.
}

export interface UploadResult {
  isImg: boolean
  name: string
  url: string
}
