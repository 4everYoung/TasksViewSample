class ExportTasksWorker
  include Sidekiq::Worker

  def perform options
    tasks = TasksFilterable.compose_tasks_collection(options)
    reports_directory = "#{Rails.root}/#{CONFIG['reports_directory']}"
    Dir.mkdir(reports_directory) unless File.directory?(CONFIG['reports_directory'])
    CSV.open( "#{reports_directory}/report_#{Time.now.strftime("%d-%m-%Y_%H-%M-%S")}.csv", 'w' ) do |writer|
      tasks.each do |task|
        writer << [task.task_group.operator.full_name, task.description, task.task_group.priority, task.task_group.name]
      end
    end
  end
end