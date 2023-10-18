import { FormRow, FormRowSelect } from "../Components/FormRow";
import Wrapper from "../assets/Wrappers/DashboardFormPage";
import {
  Form,
  useNavigation,
  useNavigate,
  redirect,
  useLoaderData,
} from "react-router-dom";
import type { ActionFunction,LoaderFunction } from "react-router"
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import axios from "axios";
import { Dog, User } from "../Types";
import { useEffect, useState } from "react";
import { Condition } from "../Types";
import { retrieveCurrentUser } from "../utils/RetrieveCurrentUser";
import { validateWeight } from "../utils/validation";
import { SubmitBtn } from "../Components/SubmitBtn";
import { useCurrentUser } from "../providers/CurrentUserProvider";
import { useConditions } from "../providers/ConditionsProvider";
import { capitalize } from "../utils/transformations";
import {validateDate} from '../utils/transformations'
import { number } from "prop-types";


type Params = {
  id: number;
};
const getExistingDogsConditions = (id:number) => {
  return axios
    .get(`http://localhost:3000/dogsConditions?dogId=${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching existing dogsConditions:", error);
    });
};
export const loader:LoaderFunction = async ({ params }) => {
  try {
    console.log('edit dog params', params);
    const { data } = await axios.get(
      `http://localhost:3000/dogs?id=${params.id}`
    );
    //const { data } = await axios.get(`http://localhost:3000/dogs`);
    console.log(data);
    const dog: Dog = data[0];

    const existingConditions = await getExistingDogsConditions(dog.id);
    const dogData = {
      dog: { ...dog },
      existingConditions: [...existingConditions],
    };
    console.log(dogData);
    return dogData;
  } catch (error) {
    toast.error("Error fetching dog:");
    return redirect("/dashboard/all-dogs");
  }
};
const postConditions = async (dogId: number, formConditions: number[]) => {
  const apiUrl = "http://localhost:3000";

  try {
    // Fetch existing dogsConditions for the specific dog ID from the API endpoint
    const existingResponse = await axios.get(
      `${apiUrl}/dogsConditions?dogId=${dogId}`
    );
    const existingDogsConditions = existingResponse.data;

    // Remove conditions that are NOT selected in the form from the database
    const conditionsToRemove = existingDogsConditions
      .filter((entry: Condition) => !formConditions.includes(entry.conditionId))
      .map((entry: Condition) => entry.id);

    // Add conditions that are selected in the form to the database
    const conditionsToAdd = formConditions
      .filter(
        (conditionId) =>
          !existingDogsConditions.some(
            (entry: Condition) => entry.conditionId === conditionId
          )
      )
      .map((conditionId) => {
        return {
          dogId: parseInt(dogId),
          conditionId: conditionId,
        };
      });

    // Remove conditions from the database
    await Promise.all(
      conditionsToRemove.map((entryId:number) =>
        axios.delete(`${apiUrl}/dogsConditions/${entryId}`)
      )
    );

    // Add new conditions to the database
    await Promise.all(
      conditionsToAdd.map((conditionData) =>
        axios.post(`${apiUrl}/dogsConditions`, conditionData)
      )
    );

    console.log("Conditions updated successfully");
  } catch (error) {
    console.error("Error updating conditions:", error);
  }
};


const getUserId = () => {
  /*  const userFromLocalStorage = localStorage.getItem('user');
  const user = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null; */
  const user = retrieveCurrentUser();

  const { id } = user;
  return { id };
};
export const action:ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
 console.log('form data', data)

  const { id } = getUserId();
  const dogData = {
    sex: capitalize(formData.get("sex")).trim(),
    name: capitalize(formData.get("name")).trim(),
    breed: capitalize(formData.get("breed")).trim(),
    birthDate: formData.get("birthDate"),
    weight: parseFloat(formData.get("weight")),
    dateVisited: formData.get("dateVisited"),
    notes: formData.get("notes").trim(),
    vetId: id,
    ownerName: capitalize(formData.get("ownerName")).trim(),
  };
  console.log("data from formData", data);
  
  const selectedConditionIdsString = (formData.getAll('condition[]'))
   const formConditions = convertFormIdsToNumbers(selectedConditionIdsString)

   console.log((typeof dogData.dateVisited))
  if(!validateDate (dogData.dateVisited)) {
    toast.error('Visit date cannot be in the future');
    return;
  }
  if (!validateDate(dogData.birthDate)) {
    toast.error('Birth date cannot be in the future');
    return;
  }
  if (!validateWeight(dogData.weight)) {
    toast.error("Weight must be a number greater than zero");
    return false;
  }

  
  
  /* or (const [key, value] of formData.entries()) {
    if (key === "condition") {
      // If the key is "condition", add the value to the conditions array
      formConditions.push(value);
    } 
  }*/
  console.log("params id", params.id);
  try {
    /* await axios.patch(`http://localhost:3000/dogs?id=${params.id}`, dogData); */
    await axios.patch(`http://localhost:3000/dogs/${params.id}`, dogData);
    postConditions(params.id, formConditions);

    toast.success("Dog edited successfully");
    return redirect("/dashboard/all-dogs");
  } catch (error) {
    toast.error("Error fetching dog:");
    return redirect("/dashboard/all-dogs");
  }
};

const convertFormIdsToNumbers = (strIds: string[]) => strIds.map((condition:string) => {
  return parseInt(condition)
})
export const EditDog: React.FC = () => {
  /* const dog: Dog = useLoaderData() as Dog; */
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { conditions } = useConditions();
  /* const [conditions, setConditions] = useState<Condition[]>([]); */
  const dog: Dog = useLoaderData().dog;
  const existingConditions: Condition[] = useLoaderData().existingConditions;
  const { conditions: allConditions } = useConditions();
  const [dogConditions, setDogConditions] = useState<Condition[]>([]);

  console.log("existing conditions", existingConditions);
   useEffect(() => {
    // Filter conditions based on dogId and existing conditions
    const filteredConditions = allConditions?.filter((condition) =>
      existingConditions.some(
        (existingCondition) => existingCondition.conditionId === condition.id
      )
    );
    setDogConditions(filteredConditions);
  }, [allConditions, existingConditions]); 

/*   const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "#212529" : "#fff",
      backgroundColor: state.isSelected ? "#a0a0a0" " : "#212529",
    }),
  

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "#212529",
      padding: "10px",
      border: "none",
      boxShadow: "none",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "red" }),
  }; */

  /*   useEffect(() => {
    // Fetch conditions when the component mounts
    const fetchConditions = async () => {
      try {
       
        const response = await fetch('http://localhost:3000/conditions');

        if (!response.ok) {
          throw new Error('Failed to fetch conditions');
        }

        const conditionsData = await response.json();
        setConditions(conditionsData);
      } catch (error) {
        console.error('Error:', error);
        toast.error('There was an error fetching the conditions');
      }
    };
    fetchConditions(); 
  }, []); */

  /*   const handleChange = (selectedOptions) => {
    console.log('handleChange', selectedOptions);
    setSelectedCondition(selectedOptions);
  }; */
  /*   const loadOptions = (searchValue, callback) => {
    const filteredOptions = optionsList.filter((option) => {
      option.label.toLowerCase().includes(searchValue.toLowerCase());
    });
    console.log('loadoptions', searchValue, filteredOptions);
    callback(filteredOptions);
  }; 
  const optionsList = conditions?.map((condition) => {
    return { label: condition.conditionName, value: condition.id };
  });*/

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit {dog.name}</h4>

        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            defaultValue={dog.name}
            labelText="Name"
          />
          <FormRow
            type="text"
            name="ownerName"
            defaultValue={dog.ownerName}
            labelText="Owner's Name"
          />
          <FormRow
            type="text"
            name="breed"
            defaultValue={dog.breed}
            labelText="Breed"
          />
          <FormRow
            type="text"
            name="sex"
            defaultValue={dog.sex}
            labelText="Sex"
          />
          <FormRow
            type="date"
            name="dateVisited"
            labelText="Date Visited"
            defaultValue={dog.dateVisited}
            max={new Date().toLocaleDateString('en-ca')}
            
          />
          <FormRow
            type="string"
            name="weight"
            defaultValue={dog.weight as string | number}
            labelText="Weight"
          />

          <FormRow
            type="date"
            name="birthDate"
            labelText="Birth Date"
            defaultValue={dog.birthDate}
            max={new Date().toLocaleDateString('en-ca')}
          />
          <div className="form-row">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              className="form-textarea"
              name="notes"
              defaultValue={dog.notes}
            ></textarea>
          </div>

          <div className="form-row">
            <label htmlFor="condition" className="form-label">
              Condition
            </label>

            <select
              className="multi-select form-select"
              name="condition[]"
              id="condition"
              /*  onChange={(e) =>
                handleSelectChange(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              } */
              multiple // Allow multiple selections
              /*  defaultValue={['']} */
               /* defaultValue={existingConditions}  */
              /* multiple */
             
            >
              {conditions?.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.conditionName}
                </option>
              ))}
            </select>
           
          </div>
         {/* < div className="form-row">
            <Select
              options={optionsList}
              isMulti
              maxMenuHeight={120}
              menuIsOpen={true}
              isSearchable={true}
              placeholder="Select Conditions"
              onChange={setSelectedValues}
              styles={customStyles}

             
            />

            <input
              name="lstCast"
              value={JSON.stringify(selectedValues)}
              hidden
              readOnly
            />
          </div>
 */}
          <div className="form-row">
            <h5 className="form-label">Current Conditions:</h5>
            <ul className="conditions-list form-textarea">
              { dogConditions.map((condition) => (
                    <li key={condition.id}>{condition.conditionName}</li>
                  ))}
              
            </ul>
          </div>
          {/* <Select multiple options={conditions} /> */}
          <div>
            <button
              type="submit"
              className="btn btn-block form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-block form-btn"
              disabled={isSubmitting}
              onClick={() => {
                navigate("/dashboard/all-dogs");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Form>
    </Wrapper>
  );
};

/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditDog = () => {
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [allConditions, setAllConditions] = useState([]);
  const [existingConditions, setExistingConditions] = useState([]);

  // Fetch all conditions and existing conditions for the dog
  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const [conditionsResponse, existingConditionsResponse] = await Promise.all([
          axios.get('http://localhost:3000/conditions'),
          axios.get(`http://localhost:3000/dogsConditions?dogId=${params.id}`),
        ]);

        setAllConditions(conditionsResponse.data);
        setExistingConditions(existingConditionsResponse.data);
      } catch (error) {
        console.error('Error fetching conditions:', error);
      }
    };

    fetchConditions();
  }, [params.id]);

  const handleSelectChange = (e) => {
    // Get the selected conditions from the select input
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedConditions(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove conditions that are NOT selected in the form from the database
    const conditionsToRemove = existingConditions
      .filter((condition) => !selectedConditions.includes(condition.conditionId))
      .map((condition) => condition.id);

    // Add conditions that are selected in the form to the database
    const conditionsToAdd = selectedConditions
      .filter((conditionId) => !existingConditions.some((condition) => condition.conditionId === conditionId))
      .map((conditionId) => ({
        dogId: params.id,
        conditionId: conditionId,
      }));

    try {
      // Remove conditions from the database
      await Promise.all(
        conditionsToRemove.map((conditionId) =>
          axios.delete(`http://localhost:3000/dogsConditions/${conditionId}`)
        )
      );

      // Add new conditions to the database
      await Promise.all(
        conditionsToAdd.map((conditionData) =>
          axios.post('http://localhost:3000/dogsConditions', conditionData)
        )
      );

      // Handle other form submission logic if needed...

      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Rest of your component code...

  return (
    // JSX for your component...
  );
};

export default EditDog;





export const action = async ({ request, params }: { request: any, params: Params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const { id } = getUserId();
  const dogData = {
    sex: formData.get('sex'),
    name: formData.get('name'),
    breed: formData.get('breed'),
    birthDate: formData.get('birthDate'),
    weight: parseFloat(formData.get('weight')),
    dateVisited: formData.get('dateVisited'),
    notes: formData.get('notes'),
    vetId: id,
  };

  const formConditions = Array.from(formData.getAll('condition'));

  if (!validateWeight(dogData.weight)) {
    toast.error('Weight must be a number greater than zero');
    return false;
  }

  try {
    await axios.patch(`http://localhost:3000/dogs/${params.id}`, dogData);
    
    // Get existing conditions for the dog
    const existingConditionsResponse = await axios.get(`http://localhost:3000/dogsConditions?dogId=${params.id}`);
    const existingConditions = existingConditionsResponse.data;

    // Remove conditions that are NOT selected in the form from the database
    const conditionsToRemove = existingConditions
      .filter((condition) => !formConditions.includes(condition.conditionId.toString()))
      .map((condition) => condition.id);

    // Add conditions that are selected in the form to the database
    const conditionsToAdd = formConditions
      .filter((conditionId) => !existingConditions.some((condition) => condition.conditionId.toString() === conditionId))
      .map((conditionId) => ({
        dogId: params.id,
        conditionId: parseInt(conditionId),
      }));

    // Remove conditions from the database
    await Promise.all(
      conditionsToRemove.map((conditionId) =>
        axios.delete(`http://localhost:3000/dogsConditions/${conditionId}`)
      )
    );

    // Add new conditions to the database
    await Promise.all(
      conditionsToAdd.map((conditionData) =>
        axios.post('http://localhost:3000/dogsConditions', conditionData)
      )
    );

    toast.success('Dog edited successfully');
    return redirect('/dashboard/all-dogs');
  } catch (error) {
    toast.error('Error fetching dog:');
    return redirect('/dashboard/all-dogs');
  }
};


const postConditions = (dogId:number, formConditions:Condition[]) => {
  const apiUrl = 'http://localhost:3000';

  // Fetch existing dogsConditions for the specific dog ID from the API endpoint
  axios
    .get(`${apiUrl}/dogsConditions?dogId=${dogId}`)
    .then((response) => {
      const existingDogsConditions = response.data;

      // Fetch all conditions from the API endpoint
      axios
        .get(`${apiUrl}/conditions`)
        .then((response) => {
          const allConditions = response.data;

          // Find Condition IDs from the fetched conditions based on condition names
          const conditionIdsToAdd:Condition[] = [];
          const conditionIdsToRemove:Condition[] = [];

          allConditions.forEach((condition:Condition) => {
            if (formConditions.includes(condition.conditionName)) {
              // If condition is in form, but not in existing conditions, add it
              if (
                !existingDogsConditions.some(
                  (entry:Condition) => entry.conditionId === condition.id
                )
              ) {
                conditionIdsToAdd.push(condition.id);
              }
            } else {
              // If condition exists for the dog but was not selected, mark it for removal
              existingDogsConditions.forEach((entry:Condition) => {
                if (
                  entry.conditionId === condition.id &&
                  entry.dogId === dogId
                ) {
                  conditionIdsToRemove.push(entry.id);
                }
              });
            }
          });

          // Remove conditions
          conditionIdsToRemove.forEach((entryId) => {
            axios
              .delete(`${apiUrl}/dogsConditions/${entryId}`)
              .then(() => {
                console.log(`Dog condition removed successfully: ${entryId}`);
              })
              .catch((error) => {
                console.error('Error removing dog condition:', error);
              });
          });

          // Add new conditions
          conditionIdsToAdd.forEach((conditionId) => {
            axios
              .post(`${apiUrl}/dogsConditions`, {
                dogId: dogId,
                conditionId: conditionId,
              })
              .then(() => {
                console.log(
                  'New dog condition added successfully:',
                  conditionId
                );
              })
              .catch((error) => {
                console.error('Error adding dog condition:', error);
              });
          });
        })
        .catch((error) => {
          console.error('Error fetching conditions:', error);
        });
    })
    .catch((error) => {
      console.error('Error fetching existing dogsConditions:', error);
    });
};
*/
