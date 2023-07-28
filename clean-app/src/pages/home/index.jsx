import Header from "./components/Header";
import TasksList from "./components/TasksList";

export default function StartingPage() {
    return (
        <>
            <Header
                progressPercent={7}
                title={"test"}
                date={"115"}
                setDate={"Sun, 13 Nov 2022 10:17:30 GMT"}
            />
            <TasksList/>
        </>);
}