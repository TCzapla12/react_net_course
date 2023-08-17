import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import customConfirm from "./customConfirm";
import RecordsPerPageSelect from "./RecordsPerPageSelect";
import Pagination from "./Pagination";
import GenericList from "./GenericList";
import { ReactElement } from "react-markdown/lib/react-markdown";

export default function IndexEntity<T>(props: IndexEntityProps<T>) {
  const [entities, setEntitites] = useState<T[]>();
  const [totalAmountOfPages, setTotalAmountOfPages] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, recordsPerPage]);

  function loadData() {
    axios
      .get(props.url, { params: { page, recordsPerPage } })
      .then((response: AxiosResponse<T[]>) => {
        const totalAmountOfRecords = parseInt(response.headers["totalamountofrecords"], 10);
        setTotalAmountOfPages(Math.ceil(totalAmountOfRecords / recordsPerPage));
        setEntitites(response.data);
      });
  }

  async function deleteEntity(id: number) {
    try {
      await axios.delete(`${props.url}/${id}`);
      loadData();
    } catch (error: any) {
      if (error && error.response) {
        console.log(error.response.data);
      }
    }
  }

  const buttons = (editUrl: string, id: number) => (
    <>
      <Link className="btn btn-success" to={editUrl}>
        Edit
      </Link>
      <Button className="btn btn-danger" onClick={() => customConfirm(() => deleteEntity(id))}>
        Delete
      </Button>
    </>
  );

  return (
    <>
      <h3>{props.title}</h3>
      <Link className="btn btn-primary" to={props.createURL}>
        Create {props.entityName}
      </Link>
      <RecordsPerPageSelect
        onChange={(amountOfRecords) => {
          setPage(1);
          setRecordsPerPage(amountOfRecords);
        }}
      />
      <Pagination
        currentPage={page}
        totalAmountOfPages={totalAmountOfPages}
        onChange={(newPage) => {
          setPage(newPage);
        }}
      />
      <GenericList list={entities}>
        <table className="table table-striped">
            {props.children(entities!, buttons)}
        </table>
      </GenericList>
    </>
  );
}

interface IndexEntityProps<T> {
  url: string;
  createURL: string;
  title: string;
  entityName: string;
  children(entities: T[], buttons: (editUrl: string, id: number) => ReactElement): ReactElement;
}
