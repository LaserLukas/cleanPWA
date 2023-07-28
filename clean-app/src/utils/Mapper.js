class Mapper {
  static dtoToTask = (id, taskDTO) => {
    const task = {
      id: id,
      title: taskDTO.title,
      responsibleId: taskDTO.responsible,
      todos: Object.keys(taskDTO.todos),
    };

    return task;
  };

  static dtoToSchedule = (id, scheduleDTO) => {
    const schedule = {
      id: id,
      title: scheduleDTO.title,
      members: Object.keys(scheduleDTO.members),
      startWeekday: scheduleDTO.startWeekday,
      endWeekday: scheduleDTO.endWeekday,
      tasks: Object.keys(scheduleDTO.tasks),
    };

    return schedule;
  };
}

export default Mapper;
