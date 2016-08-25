/*****************************************************************************
 * Open MCT Web, Copyright (c) 2014-2015, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT Web is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT Web includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

define(['./TimeConductorController'], function (TimeConductorController) {
    describe("The time conductor controller", function () {
        var mockScope;
        var mockWindow;
        var mockTimeConductor;
        var mockConductorViewService;
        var mockTimeSystems;
        var controller;

        beforeEach(function () {
            mockScope = jasmine.createSpyObj("$scope", ["$watch"]);
            mockWindow = jasmine.createSpyObj("$window", ["requestAnimationFrame"]);
            mockTimeConductor = jasmine.createSpyObj(
                "TimeConductor",
                [
                    "bounds",
                    "timeSystem",
                    "on"
                ]
            );
            mockTimeConductor.bounds.andReturn({start: undefined, end: undefined});

            mockConductorViewService = jasmine.createSpyObj(
                "ConductorViewService",
                [
                    "availableModes",
                    "mode",
                    "availableTimeSystems"
                ]
            );
            mockConductorViewService.availableModes.andReturn([]);
            mockConductorViewService.availableTimeSystems.andReturn([]);

            mockTimeSystems = [];

            controller = new TimeConductorController(
                mockScope,
                mockWindow,
                mockTimeConductor,
                mockConductorViewService,
                mockTimeSystems
            );
        });

        /*describe("sets scope based on initial state of time conductor",
            function () {

            }
        );*/

        it("listens for changes to conductor state", function () {
            expect(mockTimeConductor.on).toHaveBeenCalledWith("timeSystem", jasmine.any(Function));
            expect(mockTimeConductor.on).toHaveBeenCalledWith("bounds", jasmine.any(Function));
            expect(mockTimeConductor.on).toHaveBeenCalledWith("follow", jasmine.any(Function));
        });

        it("when bounds change, sets them on scope", function () {
            var bounds = {
                start: 1,
                end: 2
            };
            var boundsCall = mockTimeConductor.on.calls.filter(function (call){
                return call.args[0] === "bounds";
            })[0];
            expect(boundsCall).toBeDefined();
            boundsCall.args[1](bounds);
            expect(mockScope.boundsModel).toBeDefined();
            expect(mockScope.boundsModel.start).toEqual(bounds.start);
            expect(mockScope.boundsModel.end).toEqual(bounds.end);
        });

        describe("when time system changes", function () {
            var mockFormat;
            var mockDeltaFormat;
            var defaultBounds;
            var defaultDeltas;
            var mockDefaults;
            var timeSystem;
            var tsCall;
            
            beforeEach(function () {
                mockFormat = {};
                mockDeltaFormat = {};
                defaultBounds = {
                    start: 2,
                    end: 3
                };
                defaultDeltas = {
                    start: 10,
                    end: 20
                };
                mockDefaults = {
                    deltas: defaultDeltas,
                    bounds: defaultBounds
                };
                timeSystem = {
                    format: function () {
                        return mockFormat;
                    },
                    deltaFormat: function () {
                        return mockDeltaFormat;
                    },
                    defaults: function () {
                        return mockDefaults;
                    }
                };

                tsCall = mockTimeConductor.on.calls.filter(function (call){
                    return call.args[0] === "timeSystem";
                })[0];
            });
            it("sets time system on scope", function () {
                expect(tsCall).toBeDefined();
                tsCall.args[1](timeSystem);

                expect(mockScope.timeSystemModel).toBeDefined();
                expect(mockScope.timeSystemModel.selected).toBe(timeSystem);
                expect(mockScope.timeSystemModel.format).toBe(mockFormat);
                expect(mockScope.timeSystemModel.deltaFormat).toBe(mockDeltaFormat);
            });

            it("sets defaults on scope", function () {
                expect(tsCall).toBeDefined();
                tsCall.args[1](timeSystem);

                expect(mockScope.boundsModel.start).toEqual(defaultBounds.start);
                expect(mockScope.boundsModel.end).toEqual(defaultBounds.end);

                expect(mockScope.boundsModel.startDelta).toEqual(defaultDeltas.start);
                expect(mockScope.boundsModel.endDelta).toEqual(defaultDeltas.end);
            });
        });

    });
});
