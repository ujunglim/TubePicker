import SideTab from "../Component/SideTab";
import { useSelector } from "react-redux";
import { folderManage } from "../store/slices/folder";
import { Folder } from "../types";

const SideBar = () => {
  const { folderList } = useSelector(folderManage);

  return (
    <aside>
      {localStorage.getItem("login") === "true" && (
        <>
          <SideTab id="folder" title={"폴더 관리"} isFolder={false} />
          <SideTab id="liked" title={"좋아요 영상"} />
          {folderList?.map((folder: Folder) => {
            return <SideTab id={String(folder.id)} title={folder.name} />;
          })}
        </>
      )}
    </aside>
  );
};

export default SideBar;
