import { Link, redirect } from "react-router-dom";
import Wrapper from "../assets/Wrappers/Condition";
import axios from "axios";
import { toast } from "react-toastify";
import { useConditions } from "../providers/useConditions";

export const Condition = ({
  id,
  conditionName,
}: {
  id: number;
  conditionName: string;
}) => {
  const { refetchConditions } = useConditions();

  const getConditionsInUse = async (id: number) => {
    try {
      const response = await axios.get(
        ` http://localhost:3000/dogsConditions?conditionId=${id}`
      );

      if (response.status === 200) {
        const conditionsInUse = response.data;
        return conditionsInUse;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("There was an error fetching the conditions");
    }
  };
  const deleteCondition = async (id: number) => {
    const conditionsInUse = await getConditionsInUse(id);
    if (conditionsInUse.length > 0) {
      toast.error("This condition is in use and may not be deleted");
    } else {
      try {
        await axios.delete(`http://localhost:3000/conditions/${id}`);
        toast.success("The condition was deleted");
        refetchConditions();
        return redirect("/dashboard/all-conditions");
      } catch (error) {
        toast.error("There was an error deleting the condition");
        return;
      }
    }
  };

  const handleDeleteCondition = async () => {
    try {
      await deleteCondition(id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Wrapper>
      <header>
        <div className="info">
          <h5>{conditionName}</h5>
        </div>
      </header>
      <div>
        <footer className="actions">
          <button
            type="submit"
            className="btn edit-btn"
            onClick={handleDeleteCondition}
          >
            Delete Condition
          </button>

          <Link to="/Dashboard" className="btn edit-btn">
            Cancel
          </Link>
        </footer>
      </div>
    </Wrapper>
  );
};
