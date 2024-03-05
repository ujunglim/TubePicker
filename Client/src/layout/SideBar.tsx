import SideTab from "../Component/SideTab";
import { useSelector } from "react-redux";
import { appManage } from "../store/slices/app";
import { folderManage } from "../store/slices/folder";
import { Folder } from "../types";

const SideBar = () => {
  const { isLoggedIn } = useSelector(appManage);
  const { folderList } = useSelector(folderManage);

  return (
    <aside>
      {isLoggedIn && (
        <>
          <SideTab id="folder" title={"폴더 만들기"} isFolder={false} />
          <SideTab id="liked" title={"좋아요 영상"} />
          {folderList.map((folder: Folder) => {
            return <SideTab id={String(folder.id)} title={folder.name} />;
          })}
        </>
      )}
    </aside>
  );
};

export default SideBar;
