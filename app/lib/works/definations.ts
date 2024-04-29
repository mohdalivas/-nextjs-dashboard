export type WorksTableType = {
    id: string;
    project_name: string;
    employee_name: string;
    start_date: Date;
    end_date: Date;
    hours_per_day: string;
}

export type WorkForm = {
    id: string;
    project_id: string;
    employee_id: string;
    start_date: Date;
    end_date: Date;
    hours_per_day: string;
};