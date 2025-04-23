<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\ScheduleResource;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ScheduleResource::collection(Schedule::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleRequest $request)
    {
        $schedule = Schedule::create($request->all());
        return new ScheduleResource($schedule);
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        return new ScheduleResource($schedule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $schedule = Schedule::findOrfail($schedule->id);
        $schedule->update($request->all());
        return new ScheduleResource($schedule);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        Schedule::destroy($schedule->id);
        return response()->json(null, 204);
    }

    public function scheduleComposer(User $user) : mixed {
        $userData = $user->load("tasks", "schedules");
        $tasks = $userData['tasks']->toArray();
        $schedules = $userData['schedules']->toArray();

        //sorting tasks
        usort($tasks, function ($a, $b){
            return $b['priority'] <=> $a['priority'];
        });

        usort($tasks, function ($a, $b){
            return $a['due_date'] <=> $b['due_date'];
        });
        //sorting schedules
        usort($schedules, function ($a, $b){
            return $a['deadline'] <=> $b['deadline'];
        });

        foreach($tasks as $task) {
            DB::table('task_schedule')->insertOrIgnore(['task_id' => $task['id'], 'schedule_id' => $user->id]);
        }
        return compact('tasks', 'schedules');
    }
}
