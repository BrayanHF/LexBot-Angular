export interface ConfigDialog {

  title: string;
  message: string;
  action: () => void;
  showConfirmBotton: boolean;
  showCancelBotton: boolean;
  showDeleteBotton: boolean;

}
