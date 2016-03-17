def create_users
	User.destroy_all
	User.create({
		email: 'test@example.com', 
		password: '123456789'
	})

	1.upto(10) do |i|
		User.create({
			email: 		Faker::Internet.email, 
			password: 	Faker::Internet.password(8),
			first_name: Faker::Name.first_name,
			last_name: 	Faker::Name.last_name
		})
	end
end

def create_businesses
	Business.destroy_all

	1.upto(500) do |i|
		Business.create({
				name: 		Faker::Company.name,   	
				address: 	Faker::Address.street_address, 
				city: 		Faker::Address.city, 
				state: 		Faker::Address.state_abbr,
				country: 	Faker::Address.country,
				zip: 		Faker::Address.zip,
				phone: 		Faker::PhoneNumber.phone_number
			})
	end
end

def create_devices
	Device.destroy_all

	['sprint_netgear', 'sprint', 'verizon_mifi'].each do |name|
		['firefox', 'chrome', 'opera', 'ie'].each do |browser|
			['windows', 'linux', 'mac'].each do |os|
				Device.create({
						name: 		Faker::Company.name,   	
						browser: 	Faker::Address.street_address, 
						os: 		Faker::Address.city, 
					})		
			end
		end
	end
end

def create_task_groups 
	TaskGroup.destroy_all
	providers = ['Google', 'Apple', 'Yelp']
	types 		= ['Create', 'Edit', 'Reverts']
	priority  = Random.new
	users 		= User.all

	1.upto(50) do |i|
		provider = providers.sample
		type  	= types.sample

		TaskGroup.create({
			name: 			[Faker::Internet.password(8), '_', provider, type, Faker::Internet.user_name].join(''),   	
			provider: 		provider,
			task_type: 		type, 
			priority:   	priority.rand(0..3),
			assignor_id:  	users.sample.id,
			operator_id: 	users.sample.id
		})	
	end
end

def create_tasks
	Task.destroy_all
	devices 		= Device.all
	businesses 		= Business.all
	tgroups 		= TaskGroup.all
	users 			= User.all

	1.upto(500) do |i|
		Task.create({
			description: 		Faker::Company.name,   	
			device_id: 			devices.sample.id,
			business_id: 		businesses.sample.id, 
			task_group_id:  	tgroups.sample.id,
			assignee_id: 		users.sample.id   
		})	
	end
end

create_users
create_businesses
create_devices
create_task_groups
create_tasks
